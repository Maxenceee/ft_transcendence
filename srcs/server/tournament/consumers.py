import random
from channels.generic.websocket import WebsocketConsumer
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
		self.playerNumber = 0
		self.socket = socket
		self.score = 0
		self.pad_x = 0
		self.pad_z = 0
		self.keyCode = {}
		self.keyCode['left'] = 0
		self.keyCode ['right'] = 0 
		self.gameNumber = 0

class Game:
	id = ""
	players = []
	ball = []


	def __init__(self, players) -> None:
		logging.info("new game created")
		self.id = makeid(15)
		self.players = players
		self.ball = [Ball(),Ball(),Ball(),Ball(), Ball(), Ball(), Ball()]
		self.queue = queue.Queue()

	def end_game(self):
		try:
			game_list.remove(self)
		except:
			return
		for player in self.players:
			player.socket.close()
		resume_data = []
		for player in self.players:
			resume_data.append({"id": player.id, "score": player.score})
		resume_data = str(resume_data)
		resume_data = resume_data.replace("'", '"')
		Game_history.objects.create(type="2p", data=resume_data)
		logging.info("game ended TODO revove from game list")

	def next_game(self, player):
		if (player.gameNumber == 6) :
			return False
		if player.score != 5 or player.gameNumber == -1 :
			return True
		logging.info(f"player win :{player.playerNumber}, from {player.gameNumber}")
		if player.gameNumber == 0 or player.gameNumber == 1:
			if (int(player.playerNumber)%2) == 1:
				self.players[player.playerNumber - 1].score = -999
				self.players[player.playerNumber - 1].gameNumber = -1
			else :
				self.players[player.playerNumber + 1].score = -999
				self.players[player.playerNumber + 1].gameNumber = -1
			player.playerNumber = player.gameNumber
			player.gameNumber = 4
			player.score = 0
			self.ball[4].x = 0
			self.ball[4].z = 0
		elif player.gameNumber == 2 or player.gameNumber == 3:
			if (int(player.playerNumber)%2) == 1:
				self.players[player.playerNumber - 1].score = -999
				self.players[player.playerNumber - 1].gameNumber = -1
			else :
				self.players[player.playerNumber + 1].score = -999
				self.players[player.playerNumber + 1].gameNumber = -1
			player.playerNumber = player.gameNumber
			player.gameNumber = 5
			player.score = 0
			self.ball[5].x = 0
			self.ball[5].z = 0
		elif player.gameNumber == 4 or player.gameNumber == 5 :
			if (int(player.playerNumber)%2) == 1:
				self.players[player.playerNumber - 1].score = -999
				self.players[player.playerNumber - 1].gameNumber = -1
			else :
				self.players[player.playerNumber + 1].score = -999
				self.players[player.playerNumber + 1].gameNumber = -1
			player.playerNumber = player.gameNumber
			player.gameNumber = 6
			player.score = 0
			self.ball[6].x = 0
			self.ball[6].z = 0
		
		logging.info(f"player win :{player.playerNumber}, going to {player.gameNumber}, ball at {self.ball[player.gameNumber].x}")
		return True
			

	def send_all(self, type, data):
		for player in self.players:
			player.socket.send(json.dumps({"type" : type, "data" : data}))
	
	def send(self, player, type, data):
		self.players[player].socket.send(json.dumps({"type" : type, "data" : data}))

	def to_json(self):
		players = []
		for player in self.players:
			players.append({"id": self.players.index(player), "x": player.pad_x, "z": player.pad_z, "score": player.score, "gameNumber" : player.gameNumber})
		response = {
			"player": players,
			"ball" : {"x": self.ball[0].x, "z": self.ball[0].z, "direction_x": self.ball[0].direction_x, "direction_z":self.ball[0].direction_z},
			"ball2": {"x": self.ball[1].x, "z": self.ball[1].z, "direction_x": self.ball[1].direction_x, "direction_z":self.ball[1].direction_z},
			"ball3": {"x": self.ball[2].x, "z": self.ball[2].z, "direction_x": self.ball[2].direction_x, "direction_z":self.ball[2].direction_z},
			"ball4": {"x": self.ball[3].x, "z": self.ball[3].z, "direction_x": self.ball[3].direction_x, "direction_z":self.ball[3].direction_z},
			"ball5": {"x": self.ball[4].x, "z": self.ball[4].z, "direction_x": self.ball[4].direction_x, "direction_z":self.ball[4].direction_z},
			"ball6": {"x": self.ball[5].x, "z": self.ball[5].z, "direction_x": self.ball[5].direction_x, "direction_z":self.ball[5].direction_z},
			"ball7": {"x": self.ball[6].x, "z": self.ball[6].z, "direction_x": self.ball[6].direction_x, "direction_z":self.ball[6].direction_z},
		}
		return response
	
	def wallCollideTwoPlayer(self, i, playerNumber):
		# i = 0
		# while i < 7:
			if self.ball[i].x < -18.5 :
				self.ball[i].direction_x *= -1
			elif self.ball[i].x > 18.5 :
				self.ball[i].direction_x *= -1
			if self.ball[i].z < -29:
				self.players[playerNumber].score += 1	
				logging.info(f"game {self.players[playerNumber].gameNumber} score {playerNumber} is {self.players[playerNumber].score}")
				self.ball[i].x = 0
				self.ball[i].z = 0 
				self.ball[i].y = 0
				self.ball[i].direction_z *= -1
				self.ball[i].direction_x = random.uniform(math.pi * -1 + 1, math.pi - 1)
				self.ball[i].speed = 1.05
			elif self.ball[i].z > 29:
				self.players[playerNumber + 1].score +=1
				logging.info(f"game {self.players[playerNumber + 1].gameNumber} score {playerNumber + 1} is {self.players[playerNumber].score}")
				self.ball[i].x = 0
				self.ball[i].z = 0 
				self.ball[i].y = 0
				self.ball[i].direction_z *= -1
				self.ball[i].direction_x = random.uniform(math.pi * -1 + 1, math.pi - 1)
				self.ball[i].speed = 1.05
			if (self.ball[i].speed > 5) :
				self.ball[i].speed = 5
			if (self.ball[i].x < -18.5):
				self.ball[i].x = -18.49
			if (self.ball[i].x > 18.5):
				self.ball[i].x = 18.49

	def rebound_x(self, playerNumber, gameNumber ):
		# while i < 4 :
		if ((self.ball[gameNumber].z < -27 and playerNumber%2 == 1) or (self.ball[gameNumber].z > 27 and playerNumber%2 == 0)) and (self.ball[gameNumber].x < (self.players[playerNumber].pad_x + 4.5)  and self.ball[gameNumber].x > (self.players[playerNumber].pad_x - 4.5)):
			if (playerNumber%2== 1) :
				self.ball[gameNumber].direction_x = (self.ball[gameNumber].x - self.players[playerNumber].pad_x)/4.5
				self.ball[gameNumber].direction_z = 1
			else :
				self.ball[gameNumber].direction_x = (self.ball[gameNumber].x - self.players[playerNumber].pad_x)/4.5
				self.ball[gameNumber].direction_z = -1
			self.ball[gameNumber].speed *= 1.1
		if (self.ball[gameNumber].speed > 5) :
			self.ball[gameNumber].speed = 5
			# i += 1

def start_game(num):
	logging.info(f"waiting list {len(waiting_list)}")
	if len(waiting_list) == num:
		players = []
		i = 0
		for player in waiting_list:
			player.gameNumber = int(i / 2)
			player.playerNumber = i
			players.append(player)
			logging.info(f"player added to game")
			i += 1
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
	time.sleep(0.05)
	game.send(0, "setCam", {"x" : "30", "y" : "30", "z" : "60"})
	game.send(1, "setCam", {"x" : "30", "y" : "30", "z" : "-60"})
	logging.info("websocket_tournament")
	while True:
		while not game.queue.empty():
			playerID, action = game.queue.get()
			if action == "right":
				if game.players[playerID].pad_x  < 16.5 and playerID%2 == 0:
					game.players[playerID].pad_x += 0.8
					if game.players[playerID].pad_x  > 16.0 :
							game.players[playerID].pad_x = 16
				if game.players[playerID].pad_x  > -16.5 and playerID%2 == 1:
					game.players[playerID].pad_x -= 0.8
					if game.players[playerID].pad_x  < -16.0:
							game.players[playerID].pad_x = -16
			elif action == "left":
				if game.players[playerID].pad_x  > -16.5 and playerID%2 == 0:
					game.players[playerID].pad_x -= 0.8
					if game.players[playerID].pad_x  < -16.0:
							game.players[playerID].pad_x = -16
				if game.players[playerID].pad_x  < 16.5 and playerID%2 == 1:
					game.players[playerID].pad_x += 0.8
					if game.players[playerID].pad_x  > 16.0 :
						game.players[playerID].pad_x = 16
		time.sleep(0.05)
		for player in game.players :
			game.ball[player.gameNumber].x += game.ball[player.gameNumber].direction_x * 0.2 * game.ball[player.gameNumber].speed
			game.ball[player.gameNumber].z += game.ball[player.gameNumber].direction_z * 0.2 * game.ball[player.gameNumber].speed
		i = 0
		for player in game.players :
			if player.gameNumber != -1:
				game.wallCollideTwoPlayer(game.players[i].gameNumber, game.players[i].playerNumber)
				game.rebound_x(game.players[i].playerNumber, game.players[i].gameNumber)
			i += 1
		game.send_all("gameState", game.to_json())
		for player in game.players:
			if player.score  > 4 and player.gameNumber != -1:
				if game.next_game(player) == False:
					game.end_game()
					return


class websocket_tournament(WebsocketConsumer):

	def connect(self):
		
		cookies = {}
		data = self.scope['headers']
		for i in data:
			if b'cookie' in i:
				cookie = i[1].decode('utf-8')
				cookie = cookie.split(';')
				for j in cookie:
					j = j.strip()
					j = j.split('=')
					cookies[j[0]] = j[1]
		token = cookies['token']
		if not Token.objects.filter(token=token).exists():
			return
		token = Token.objects.get(token=token)
		if token.is_valid:
			self.accept()
		else:
			return
		user = token.user

		logging.info(user.id)
		logging.info("new player connected")
		waiting_list.append(Player(user.id, self))
		start_game(8)
	
	def find_game(self):
		global game_list
		for current in game_list:
			current_players = current.players
			for player in current_players:
				if player.socket == self:
					self.playerID = current_players.index(player)
					self.data = current
					return


	def receive(self, text_data=None, bytes_data=None):
		if not hasattr(self, "data"):
			self.find_game()
			if not hasattr(self, "data"):
				return
		receive_package = json.loads(text_data)

		if receive_package['type'] == "keyCode":
			try:
				if receive_package['move'] == "left":
					self.data.queue.put([self.playerID, "left"])
					return
				elif receive_package['move'] == "right":
					self.data.queue.put([self.playerID, "right"])
					return
			except:
				return
		return

	def disconnect(self, code):
		print("server says disconnected")
		if hasattr(self, "data"):
			self.data.end_game()
		else:
			for player in waiting_list:
				if player.socket == self:
					waiting_list.remove(player)