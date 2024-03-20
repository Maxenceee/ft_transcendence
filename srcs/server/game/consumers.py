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
		self.pad_x = 0
		self.pad_z = 0
		self.keyCode = {}
		self.keyCode['left'] = 0
		self.keyCode ['right'] = 0 

class Game:
	id = ""
	players = []


	def __init__(self, players) -> None:
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
				if User.objects.filter(id=player.id).exists():
					user = User.objects.get(id=player.id)
					user.is_ingame = False
					user.save()
			except:
				continue
		if self.players[0].score == 0 and self.players[1].score == 0:
			return
		resume_data = []
		for player in self.players:
			resume_data.append({"id": player.id, "score": player.score})
		resume_data = str(resume_data)
		resume_data = resume_data.replace("'", '"')
		Game_history.objects.create(type="2p", data=resume_data)
		logging.info("game ended" + self.id)

	def send_all(self, type, data):
		for player in self.players:
			try:
				player.socket.send(json.dumps({"type" : type, "data" : data}))
			except:
				logging.info("error send all :" + str(player.id))
	
	def send(self, player, type, data):
		try:
			self.players[player].socket.send(json.dumps({"type" : type, "data" : data}))
		except:
			logging.info("error send :" + str(self.players[player].id))

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
			self.ball.direction_x *= -1
		elif self.ball.x > 18.5 :
			self.ball.direction_x *= -1
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
		if (self.ball.speed > 5) :
			self.ball.speed = 5
		if (self.ball.x < -18.5):
			self.ball.x = -18.49
		if (self.ball.x > 18.5):
			self.ball.x = 18.49

	def rebound_x(self, playerID):
		if ((self.ball.z < -27 and playerID == 1) or (self.ball.z > 27 and playerID == 0)) and (self.ball.x < (self.players[playerID].pad_x + 4.5)  and self.ball.x > (self.players[playerID].pad_x - 4.5)):
			if (playerID == 1) :
				self.ball.direction_x = (self.ball.x - self.players[playerID].pad_x)/4.5
				self.ball.direction_z = 1
			else :
				self.ball.direction_x = (self.ball.x - self.players[playerID].pad_x)/4.5
				self.ball.direction_z = -1
			self.ball.speed *= 1.1
		if (self.ball.speed > 5) :
			self.ball.speed = 5

def start_game(num):
	logging.info(f"waiting list {len(waiting_list)}")
	if len(waiting_list) == num:
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
		logging.info(f"game created" + game.id)
	else:
		logging.info("pas assez de joueurs :" + len(waiting_list))



def game_master(game):
	game.send_all("gameState", game.to_json())
	game.send(0, "setCam", {"x" : "30", "y" : "30", "z" : "60"})
	game.send(1, "setCam", {"x" : "30", "y" : "30", "z" : "-60"})
	while True:
		while not game.queue.empty():
			playerID, action = game.queue.get()
			if action == "right":
				if game.players[playerID].pad_x  < 16.5 and playerID == 0:
					game.players[playerID].pad_x += 0.8
					if game.players[playerID].pad_x  > 16.0 :
							game.players[playerID].pad_x = 16
				if game.players[playerID].pad_x  > -16.5 and playerID == 1:
					game.players[playerID].pad_x -= 0.8
					if game.players[playerID].pad_x  < -16.0:
							game.players[playerID].pad_x = -16
			elif action == "left":
				if game.players[playerID].pad_x  > -16.5 and playerID == 0:
					game.players[playerID].pad_x -= 0.8
					if game.players[playerID].pad_x  < -16.0:
							game.players[playerID].pad_x = -16
				if game.players[playerID].pad_x  < 16.5 and playerID == 1:
					game.players[playerID].pad_x += 0.8
					if game.players[playerID].pad_x  > 16.0 :
						game.players[playerID].pad_x = 16
			elif action == "disconnect":
				logging.info("player disconnected : " + game.players[playerID].id + "(" + str(playerID) + ")" )
				game.players[playerID].score = 0
				game.end_game()
				return

		time.sleep(0.05)
		game.ball.x += game.ball.direction_x * 0.4 * game.ball.speed
		game.ball.z += game.ball.direction_z * 0.4 * game.ball.speed
		game.wallCollideTwoPlayer()
		game.rebound_x(0)
		game.rebound_x(1)
		game.send_all("gameState", game.to_json())
		for player in game.players:
			if player.score  > 9 :
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
		waiting_list.append(Player(user.id, self))
		start_game(2)
		logging.info("user connected : " + str(user.id))

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
				if receive_package['move'] == "left":
					self.data.queue.put([self.playerID, "left"])
					return
				elif receive_package['move'] == "right":
					self.data.queue.put([self.playerID, "right"])
					return
		except:
			pass

	def disconnect(self, code):
		logging.info(f"user disconnected : {code}")
		super().disconnect(code)
		self.find_game()
		if hasattr(self, "data"):
			self.data.queue.put([self.playerID, "disconnect"])
		else:
			for player in waiting_list:
				if player.socket == self:
					if User.objects.filter(id=player.id).exists():
						user = User.objects.get(id=player.id)
						user.is_ingame = False
						user.save()
					waiting_list.remove(player)