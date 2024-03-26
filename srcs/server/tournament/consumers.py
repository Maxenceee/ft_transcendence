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
		# self.gamePosition = [0, 0]

	def __str__(self) -> str:
		return f"{self.id}: idx: {self.playerNumber} score: {self.score} pad_x: {self.pad_x} gamenum: {self.gameNumber}"

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
		# Game_history.objects.create(type="2p", data=resume_data)

	def next_game(self, playerOrg):
		if (playerOrg.gameNumber == 6) :
			return False
		
		logging.info(f"player win :{playerOrg.playerNumber}, from {playerOrg.gameNumber}")
		for player in self.players :
				logging.info(f"player{player.playerNumber}, score : {player.score}, gameN :{player.gameNumber}")


		target = None
		for player in self.players :
				if player.gameNumber == playerOrg.gameNumber and player.playerNumber != playerOrg.playerNumber :
					target = player
		if target is None :
				logging.info("you won against nothing, how ?")
				return False
		

		if playerOrg.gameNumber == 0 or playerOrg.gameNumber == 1:
			target.score = -999
			target.gameNumber = -1
			target.playerNumber = -1

			playerOrg.gameNumber = 4
			playerOrg.score = 0
			playerOrg.pad_x = 0
			self.ball[4].x = 0
			self.ball[4].z = 0
			self.ball[4].speed = 1.05
		
		elif playerOrg.gameNumber == 2 or playerOrg.gameNumber == 3:
			target.score = -999
			target.gameNumber = -1
			target.playerNumber = -1

			playerOrg.gameNumber = 5
			playerOrg.score = 0
			playerOrg.pad_x = 0
			self.ball[5].x = 0
			self.ball[5].z = 0
			self.ball[5].speed = 1.05

		
		elif playerOrg.gameNumber == 4 or playerOrg.gameNumber == 5 :
			target.score = -999
			target.gameNumber = -1
			target.playerNumber = -1
			playerOrg.gameNumber = 6
			playerOrg.pad_x = 0
			playerOrg.score = 0
			self.ball[6].x = 0
			self.ball[6].z = 0
			self.ball[6].speed = 1.05

		logging.info("end with :")
		for player in self.players :
			logging.info(f"{str(player)}")
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
			players.append({"x": player.pad_x, "z": player.pad_z, "score": player.score, "gameNumber" : player.gameNumber})
		response = {
			"player": players,
			"ball" : {"x": self.ball[0].x, "z": self.ball[0].z},
			"ball2": {"x": self.ball[1].x, "z": self.ball[1].z},
			"ball3": {"x": self.ball[2].x, "z": self.ball[2].z},
			"ball4": {"x": self.ball[3].x, "z": self.ball[3].z},
			"ball5": {"x": self.ball[4].x, "z": self.ball[4].z},
			"ball6": {"x": self.ball[5].x, "z": self.ball[5].z},
			"ball7": {"x": self.ball[6].x, "z": self.ball[6].z},
		}
		return response

	def wallCollideTwoPlayer(self, gameNum):
		gameplayer = []
		for current in self.players:
			if current.gameNumber == gameNum:
				gameplayer.append(current)
		if len(gameplayer) != 2:
			return
		if self.ball[gameNum].x < -18.5 :
			self.ball[gameNum].direction_x *= -1
		elif self.ball[gameNum].x > 18.5 :
			self.ball[gameNum].direction_x *= -1
		if self.ball[gameNum].z < -29:
			gameplayer[0].score += 1
			self.ball[gameNum].x = 0
			self.ball[gameNum].z = 0 
			self.ball[gameNum].y = 0
			self.ball[gameNum].direction_z *= -1
			self.ball[gameNum].direction_x = random.uniform(math.pi * -1 + 1, math.pi - 1)
			self.ball[gameNum].speed = 1.05
		elif self.ball[gameNum].z > 29:
			gameplayer[1].score += 1
			self.ball[gameNum].x = 0
			self.ball[gameNum].z = 0 
			self.ball[gameNum].y = 0
			self.ball[gameNum].direction_z *= -1
			self.ball[gameNum].direction_x = random.uniform(math.pi * -1 + 1, math.pi - 1)
			self.ball[gameNum].speed = 1.05
		if (self.ball[gameNum].speed > 5) :
			self.ball[gameNum].speed = 5
		if (self.ball[gameNum].x < -18.5):
			self.ball[gameNum].x = -18.49
		if (self.ball[gameNum].x > 18.5):
			self.ball[gameNum].x = 18.49

	def rebound_x(self, gameNum, playerPos):
		gameplayer = []
		for current in self.players:
			if current.gameNumber == gameNum:
				gameplayer.append(current)
		if len(gameplayer) != 2:
			return

		if ((self.ball[gameNum].z < -27 and playerPos == 1) or (self.ball[gameNum].z > 27 and playerPos == 0)) and (self.ball[gameNum].x < (gameplayer[playerPos].pad_x + 4.5)  
				and self.ball[gameNum].x > (gameplayer[playerPos].pad_x - 4.5)):
			
			if (playerPos== 1) :
				self.ball[gameNum].direction_x = (self.ball[gameNum].x - gameplayer[playerPos].pad_x)/4.5
				self.ball[gameNum].direction_z = 1
			else :
				self.ball[gameNum].direction_x = (self.ball[gameNum].x - gameplayer[playerPos].pad_x)/4.5
				self.ball[gameNum].direction_z = -1

			self.ball[gameNum].speed *= 1.1
		if (self.ball[gameNum].speed > 5) :
			self.ball[gameNum].speed = 5
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
		game = Game(players)
		game_list.append(game)
		threading.Thread(target=game_master, args=(game,)).start()
		logging.info(f"game created")
	else:
		logging.info("pas assez de joueurs")



def game_master(game):
	game.send_all("gameState", game.to_json())
	time.sleep(0.05)
	game.send(0, "setCam", {"x" : "30", "y" : "30", "z" : "60" , "camx" :"0", "camy" :"0", "camz" :"0"})
	game.send(1, "setCam", {"x" : "30", "y" : "30", "z" : "-60", "camx" :"0", "camy" :"0", "camz" :"0"})
	game.send(2, "setCam", {"x" : "110", "y" : "30", "z" : "60" , "camx" :"80.0", "camy" :"0", "camz" :"0"})
	game.send(3, "setCam", {"x" : "110", "y" : "30", "z" : "-60", "camx" :"80.0", "camy" :"0", "camz" :"0"})
	game.send(4, "setCam", {"x" : "190", "y" : "30", "z" : "60" , "camx" :"160.0", "camy" :"0", "camz" :"0"})
	game.send(5, "setCam", {"x" : "190", "y" : "30", "z" : "-60", "camx" :"160.0", "camy" :"0", "camz" :"0"})
	game.send(6, "setCam", {"x" : "270", "y" : "30", "z" : "60" , "camx" :"240.0", "camy" :"0", "camz" :"0"})
	game.send(7, "setCam", {"x" : "270", "y" : "30", "z" : "-60", "camx" :"240.0", "camy" :"0", "camz" :"0"})

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
		i = 0
		while i < 7 :
			game.ball[i].z += game.ball[i].direction_z * 0.4 * game.ball[i].speed
			game.ball[i].x += game.ball[i].direction_x * 0.4 * game.ball[i].speed
			i +=1
		i = 0
		for current in game.ball:
			game.wallCollideTwoPlayer(i)
			game.rebound_x(i, 0)
			game.rebound_x(i, 1)
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