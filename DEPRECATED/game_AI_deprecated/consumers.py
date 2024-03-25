import random
from channels.generic.websocket import WebsocketConsumer
from django.http import HttpResponse
from index.models import *
import json
import logging
import time
import math
import threading
import queue

def makeid(len):
	str = "abcdefghijklmnopqrstuvwxyz0123456789"
	res = ""
	for _ in range(len):
		res += str[random.randint(0, 35)]
	return res

game_list = []

class AIPlayer:
	def __init__(self):
		self.id = "ai_"+makeid(15)
		self.running = False
		self.thread = None
		self.queue = queue.Queue()
		self.game = None
		self.score = 0
		self.pad_x = 0
		self.pad_z = 0

	def start(self):
		self.running = True
		self.thread = threading.Thread(target=self.run)
		self.thread.start()

	def stop(self):
		self.running = False
		self.thread.join()

	# def runEasy(self):
	# 	while self.running:
	# 		ball_x = self.game.ball.x
	# 		dir_z = self.game.ball.direction_z
	# 		pad_x = self.game.players[1].pad_x
	# 		dif = pad_x - ball_x
			
	# 		if int(dif) >= 0 and dir_z == -1:
	# 			for i in range(int(dif)):
	# 				self.game.queue.put([1, "right"])
	# 				time.sleep(0.1)
	# 		elif dir_z == -1:
	# 			for i in range(int(-dif)):
	# 				self.game.queue.put([1, "left"])
	# 				time.sleep(0.1)
	# 		else:
	# 			if int(pad_x) >= 0:
	# 				for i in range (int(pad_x)):
	# 					self.game.queue.put([1, "right"])
	# 					time.sleep(0.1)
	# 			else:
	# 				for i in range (int(-pad_x)):
	# 					self.game.queue.put([1, "left"])
	# 					time.sleep(0.1)

	# 		time.sleep(1)

	def run(self):
		data = None
		while self.running:
			while not game.queue.empty():
				action = game.queue.get()
				if action.type == "disconnect":
					self.stop()
					return
				elif action.type == "gameState":
					data = json.loads(action.data)
					logging.info(f"data in ai: {data}")

			if not data:
				continue

			i = 1
			ball_x = data.ball.x
			ball_z = data.ball.z
			dir_x = data.ball.direction_x
			dir_z = data.ball.direction_z
			pad_x = data.players[1].pad_x
			future_ball_x = ball_x
			future_ball_z = ball_z
			if (dir_z == -1):
				i = 0
			if i == 0:
				tmp = 1
				while (future_ball_z >= -27):
					future_ball_x += data.ball.speed * dir_x * tmp
					future_ball_z -= data.ball.speed
					if future_ball_x > 18.5 or future_ball_x <  -18.5:
						tmp *=-1
					i += 1
				future_ball_x += random.uniform(-3.5, 3.5)
			dif = pad_x - future_ball_x
			if int(dif) >= 0 and dir_z == -1:
				for i in range(int(dif)):
					self.game.queue.put([1, "right"])
					time.sleep(0.05)
			elif dir_z == -1:
				for i in range(int(-dif)):
					self.game.queue.put([1, "left"])
					time.sleep(0.05)
			else:
				if int(pad_x) >= 0:
					for i in range (int(pad_x)):
						self.game.queue.put([1, "right"])
						time.sleep(0.05)
				else:
					for i in range (int(-pad_x)):
						self.game.queue.put([1, "left"])
						time.sleep(0.05)
			time.sleep(1)


class Ball:
	def __init__(self) -> None:
		self.x = 0
		self.z = 0
		self.direction_x = random.uniform((math.pi * -1 + 1) * 0.666, (math.pi - 1) * 0.666)
		self.direction_z = 1
		self.speed = 1.05


class Player:
	def __init__(self, id, socket) -> None:
		self.id = id
		self.socket = socket
		self.socket.player = self
		self.score = 0
		self.pad_x = 0
		self.pad_z = 0
		self.game = None
		self.keyCode = {}
		self.keyCode['left'] = 0
		self.keyCode ['right'] = 0


class Game:
	id = ""
	players = []
	ai_player = None

	def __init__(self, players) -> None:
		logging.info("new game created")
		self.id = makeid(15)
		self.players = players
		self.ball = Ball()
		self.queue = queue.Queue()
		for player in self.players:
			player.game = self


	def end_game(self):
		logging.info(f"game ended called: {self.id} (ai)")
		try:
			game_list.remove(self)
		except:
			return
		for player in self.players:
			if isinstance(player, AIPlayer):
				player.queue.put({"type" : "disconnect"})
				continue
			try:
				user = User.objects.get(id=player.id)
				user.is_ingame = False
				user.save()
				player.socket.close()
				logging.info(f"socket closed: {player.id}")
			except:
				continue
		logging.info(f"game ended: {self.id}")


	def send_all(self, type, data):
		for player in self.players:
			try:
				if (isinstance(player, AIPlayer)):
					player.queue.put({"type" : type, "data" : data})
				else:
					player.socket.send(json.dumps({"type" : type, "data" : data}))
			except:
				continue


	def send(self, player, type, data):
		try:
			self.players[player].socket.send(json.dumps({"type" : type, "data" : data}))
		except:
			logging.info(f"error send: {self.players[player].id}")


	def to_json(self):
		players = []
		for player in self.players:
			players.append({"id": self.players.index(player), "x": player.pad_x, "z": player.pad_z, "score": player.score})
		response = {
			"player": players,
			"ball": {"x": self.ball.x, "z": self.ball.z, "direction_x": self.ball.direction_x, "direction_z":self.ball.direction_z},
			"moveSpeed": self.ball.speed
		}
		return response


	def wallCollideTwoPlayer(self):

		if self.ball.x < -18.5 :
			self.ball.direction_x *= -1 #naive version
		elif self.ball.x > 18.5 :
			self.ball.direction_x *= -1 #naive version
		if self.ball.z < -29:
			self.players[0].score += 1
			self.ball.x = 0
			self.ball.z = 0 
			self.ball.y = 0
			self.ball.direction_z *= -1
			self.ball.direction_x = random.uniform(math.pi * -1 + 1, math.pi - 1)
			self.ball.speed = 1.05

		elif self.ball.z > 29:
			self.players[1].score +=1
			self.ball.x = 0
			self.ball.z = 0 
			self.ball.y = 0
			self.ball.direction_z *= -1
			self.ball.direction_x = random.uniform(math.pi * -1 + 1, math.pi - 1)
			self.ball.speed = 1.05
		if (self.ball.speed > 5) :
			self.ball.speed = 5
		if (self.ball.x < -18.5):
			self.ball.x = -18.49
		if (self.ball.x > 18.5):
			self.ball.x = 18.49


	def rebound_x(self):
		if (self.ball.z > 27 ) and (self.ball.x < (self.players[1].pad_x + 4.5)  and self.ball.x > (self.players[1].pad_x - 4.5)):
			self.ball.direction_x = (self.ball.x - self.players[1].pad_x)/4.5
			self.ball.direction_z = -1
			self.ball.speed *= 1.1
		elif (self.ball.z < -27 ) and (self.ball.x < (self.players[1].pad_x + 4.5)  and self.ball.x > (self.players[1].pad_x - 4.5)):
			self.ball.direction_x = (self.ball.x - self.players[1].pad_x)/4.5
			self.ball.direction_z = 1
			self.ball.speed *= 1.1
		if (self.ball.speed > 5) :
			self.ball.speed = 5


def start_game(player):
	players = []
	ai_player = AIPlayer()
	players.append(player)
	players.append(ai_player)
	logging.info(f"player added to game (ai)")
	game = Game(players)
	game_list.append(game)
	threading.Thread(target=game_master, args=(game,)).start()
	logging.info(f"game created (ai)")


def game_master(game):
	game.send_all("gameState", game.to_json())
	game.send(0, "setCam", {"x" : "30", "y" : "30", "z" : "-60"})
	game.send(1, "setCam", {"x" : "30", "y" : "30", "z" : "60"})
	while True:
		while not game.queue.empty():
			playerID, action = game.queue.get()
			if action == "right":
				if game.players[0].pad_x  < 16.5 and playerID == 0:
					game.players[0].pad_x += 0.8
					if game.players[0].pad_x  > 16.0 :
							game.players[0].pad_x = 16
				if game.players[1].pad_x  > -16.5 and playerID == 1:
					game.players[1].pad_x -= 0.8
					if game.players[1].pad_x  < -16.0:
							game.players[1].pad_x = -16
			elif action == "left":
				if game.players[0].pad_x  > -16.5 and playerID == 0:
					game.players[0].pad_x -= 0.8
					if game.players[0].pad_x  < -16.0:
							game.players[0].pad_x = -16
				if game.players[1].pad_x  < 16.5 and playerID == 1:
					game.players[1].pad_x += 0.8
					if game.players[1].pad_x  > 16.0 :
						game.players[1].pad_x = 16
		time.sleep(0.05)
		game.ball.x += game.ball.direction_x * 0.4 * game.ball.speed
		game.ball.z += game.ball.direction_z * 0.4 * game.ball.speed
		game.wallCollideTwoPlayer()
		game.rebound_x()
		game.send_all("gameState", game.to_json())
		for player in game.players:
			# logging.info(f"game_master score check: {player.score} {player.id}")
			if player.score  > 9:
				# game.ai_player.stop()
				game.end_game()
				return


class websocket_client(WebsocketConsumer):

	def connect(self):
		cookies = {}
		try:
			data = self.scope['headers']
		except:
			return
		for i in data:
			if b'cookie' in i:
				cookie = i[1].decode('utf-8')
				cookie = cookie.split(';')
				for j in cookie:
					j = j.strip()
					j = j.split('=')
					cookies[j[0]] = j[1]

		logging.info("new player connected")
		try:
			token = cookies['token']
		except:
			return logging.info("user connection rejected token not found")
		if not Token.objects.filter(token=token).exists():
			return logging.info("user connection rejected token not found")
		token = Token.objects.get(token=token)
		if token.is_valid == True:
			if token.user.is_ingame == False:
				token.user.is_ingame = True
				token.user.save()
				self.accept()
			else:
				return logging.info("user connection rejected user already in game")
		else:
			return logging.info("user connection rejected token not valid")
		user = token.user

		logging.info(f"new player connected {user.id}")
		start_game(Player(user.id, self))
	
	# def find_game(self):
	# 	global game_list
	# 	for current in game_list:
	# 		current_players = current.players
	# 		for player in current_players:
	# 			if player.socket == self:
	# 				self.playerID = current_players.index(player)
	# 				self.data = current
	# 				return


	def receive(self, text_data=None):
		logging.info(f"received: {self.player.game.id}")
		if not hasattr(self, "player") or not hasattr(self.player, "game"):
			return logging.info("no game found")
		receive_package = json.loads(text_data)

		try:
			if receive_package['type'] == "keyCode":
				try:
					if receive_package['move'] == "left":
						self.player.game.queue.put([0, "left"])
						return
					elif receive_package['move'] == "right":
						self.player.game.queue.put([0, "right"])
						return
				except:
					return
			# if receive_package['type'] == "keyCode2P":
			# 	try:
			# 		if receive_package['move'] == "left":
			# 			self.player.game.queue.put([0, "left"])
			# 			return
			# 		elif receive_package['move'] == "right":
			# 			self.player.game.queue.put([0, "right"])
			# 			return
			# 	except:
			# 		return
			return
		except:
			logging.ingo("error in recv")
			pass

	def disconnect(self, code):
		super().disconnect(code)
		if hasattr(self, "game"):
			logging.info(f"server says disconnected : {code}")
			self.player.game.queue.put([self.playerID, "disconnect"])