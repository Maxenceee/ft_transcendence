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

waiting_list = []
game_list = []

class AIPlayer:
	def __init__(self, game):
		self.game = game
		self.running = False
		self.thread = threading.Thread(target=self.run)

	def start(self):
		self.running = True
		self.thread.start()

	def stop(self):
		self.running = False
		self.thread.join()

	# def runEasy(self):
	# 	while self.running:
	# 		ball_x = self.game.ball.x
	# 		dir_z = self.game.ball.direction_z
	# 		pad_x = self.game.players[1].pad_xP2
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
		while self.running:
			i = 1
			ball_x = self.game.ball.x
			ball_z = self.game.ball.z
			dir_x = self.game.ball.direction_x
			dir_z = self.game.ball.direction_z
			pad_x = self.game.players[1].pad_xP2
			future_ball_x = ball_x
			future_ball_z = ball_z
			if (dir_z == -1):
				i = 0
			if i == 0:
				tmp = 1
				while (future_ball_z >= -27):
					future_ball_x += self.game.ball.speed * dir_x * tmp
					future_ball_z -= self.game.ball.speed
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
		self.score = 0
		self.scoreP2 = 0
		self.pad_x = 0
		self.pad_z = 0
		self.pad_xP2 = 0
		self.pad_zP2 = 0
		self.keyCode = {}
		self.keyCode['left'] = 0
		self.keyCode ['right'] = 0 


class Game:
	id = ""
	players = []


	def __init__(self, players) -> None:
		logging.info("new game created")
		self.id = makeid(15)
		self.players = players
		self.ball = Ball()
		self.queue = queue.Queue()

	def end_game(self):
		try:
			game_list.remove(self)
		except:
			return
		for player in self.players:
			try:
				player.socket.close()
			except:
				continue

	def send_all(self, type, data):
		for player in self.players:
			try:
				player.socket.send(json.dumps({"type" : type, "data" : data}))
			except:
				continue
	
	def send(self, player, type, data):
		try:
			self.players[player].socket.send(json.dumps({"type" : type, "data" : data}))
		except:
			return

	def to_json(self):
		players = []
		for player in self.players:
			players.append({"id": self.players.index(player), "x": player.pad_x, "z": player.pad_z,"xP2": player.pad_xP2, "zP2": player.pad_zP2, "score": player.score, "scoreP2" : player.scoreP2})
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
			self.players[1].scoreP2 +=1
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
		elif (self.ball.z < -27 ) and (self.ball.x < (self.players[1].pad_xP2 + 4.5)  and self.ball.x > (self.players[1].pad_xP2 - 4.5)):
			self.ball.direction_x = (self.ball.x - self.players[1].pad_xP2)/4.5
			self.ball.direction_z = 1
			self.ball.speed *= 1.1
		if (self.ball.speed > 5) :
			self.ball.speed = 5

def start_game(num):
	logging.info(f"waiting list {len(waiting_list)}")
	if num == 1 :
		players = []
		for player in waiting_list:
			players.append(player)
			players.append(player)
			logging.info(f"player added to game")
		waiting_list.remove(player)
		logging.info(f"player remove from waiting list")
		game = Game(players)
		game_list.append(game)
		threading.Thread(target=game_master, args=(game,)).start()
		logging.info(f"game created")
		return
	elif len(waiting_list) == num:
		players = []
		for player in waiting_list:
			players.append(player)
			logging.info(f"player added to game")
		for player in players:
			waiting_list.remove(player)
			logging.info(f"player remove from waiting list")
		game = Game(players)
		game_list.append(game)
		threading.Thread(target=game_master, args=(game,)).start()
		logging.info(f"game created")
	else:
		logging.info("pas assez de joueurs")



def game_master(game):
	game.send_all("gameState", game.to_json())
	game.send(0, "setCam", {"x" : "30", "y" : "30", "z" : "-60"})
	game.send(1, "setCam", {"x" : "30", "y" : "30", "z" : "60"})
	ai_player = AIPlayer(game)
	ai_player.start()
	while True:
		while not game.queue.empty():
			playerID, action = game.queue.get()
			if action == "right":
				if game.players[0].pad_x  < 16.5 and playerID == 0:
					game.players[0].pad_x += 0.8
					if game.players[0].pad_x  > 16.0 :
							game.players[0].pad_x = 16
				if game.players[1].pad_xP2  > -16.5 and playerID == 1:
					game.players[1].pad_xP2 -= 0.8
					if game.players[1].pad_xP2  < -16.0:
							game.players[1].pad_xP2 = -16
			elif action == "left":
				if game.players[0].pad_x  > -16.5 and playerID == 0:
					game.players[0].pad_x -= 0.8
					if game.players[0].pad_x  < -16.0:
							game.players[0].pad_x = -16
				if game.players[1].pad_xP2  < 16.5 and playerID == 1:
					game.players[1].pad_xP2 += 0.8
					if game.players[1].pad_xP2  > 16.0 :
						game.players[1].pad_xP2 = 16
		time.sleep(0.05)
		game.ball.x += game.ball.direction_x * 0.4 * game.ball.speed
		game.ball.z += game.ball.direction_z * 0.4 * game.ball.speed
		game.wallCollideTwoPlayer()
		game.rebound_x()
		game.send_all("gameState", game.to_json())
		for player in game.players:
			if player.score  > 9 :
				ai_player.stop()
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
			return
		if not Token.objects.filter(token=token).exists():
			return
		token = Token.objects.get(token=token)
		if token.is_valid == True:
			self.accept()
		else:
			return
		user = token.user

		logging.info(user.id)
		logging.info("new player connected")
		waiting_list.append(Player(user.id, self))
		start_game(1)
	
	def find_game(self):
		global game_list
		for current in game_list:
			current_players = current.players
			for player in current_players:
				if player.socket == self:
					self.playerID = current_players.index(player)
					self.data = current
					return


	def receive(self, text_data=None):
		if not hasattr(self, "data"):
			self.find_game()
			if not hasattr(self, "data"):
				return
		receive_package = json.loads(text_data)

		try:
			if receive_package['type'] == "keyCode":
				try:
					if receive_package['move'] == "left":
						self.data.queue.put([0, "left"])
						return
					elif receive_package['move'] == "right":
						self.data.queue.put([0, "right"])
						return
				except:
					return
			if receive_package['type'] == "keyCode2P":
				try:
					if receive_package['move'] == "left":
						self.data.queue.put([0, "left"])
						return
					elif receive_package['move'] == "right":
						self.data.queue.put([0, "right"])
						return
				except:
					return
			return
		except:
			pass

	def disconnect(self, code):
		super().disconnect(code)
		self.find_game()
		if hasattr(self, "data"):
			logging.info(f"server says disconnected : {code}")
			self.data.queue.put([self.playerID, "disconnect"])
		else:
			for player in waiting_list:
				if player.socket == self:
					waiting_list.remove(player)