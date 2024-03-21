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
		self.ball = [Ball(),Ball(),Ball(),Ball()]
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
		Game_history.objects.create(type="2v2", data=resume_data)
		logging.info("game ended TODO revove from game list")

	def next_game(self):
		return False

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
		}
		return response
	
	def wallCollideTwoPlayer(self):
		i = 0
		while i < 4:
			if self.ball[i].x < -18.5 :
				self.ball[i].direction_x *= -1
			elif self.ball[i].x > 18.5 :
				self.ball[i].direction_x *= -1
			if self.ball[i].z < -29:
				self.players[i * 2].score += 1					#	not enought player to turn it on
				self.ball[i].x = 0
				self.ball[i].z = 0 
				self.ball[i].y = 0
				self.ball[i].direction_z *= -1
				self.ball[i].direction_x = random.uniform(math.pi * -1 + 1, math.pi - 1)
				self.ball[i].speed = 1.05
			elif self.ball[i].z > 29:
				self.players[i * 2 + 1].score +=1				#		not enought player to turn it on
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
			i +=1

	def rebound_x(self, playerID):
		i = 0
		while i < 4 :
			if ((self.ball[i].z < -27 and playerID == 1) or (self.ball[i].z > 27 and playerID == 0)) and (self.ball[i].x < (self.players[playerID].pad_x + 4.5)  and self.ball[i].x > (self.players[playerID].pad_x - 4.5)):
				if (playerID == 1) :
					self.ball[i].direction_x = (self.ball[i].x - self.players[playerID].pad_x)/4.5
					self.ball[i].direction_z = 1
				else :
					self.ball[i].direction_x = (self.ball[i].x - self.players[playerID].pad_x)/4.5
					self.ball[i].direction_z = -1
				self.ball[i].speed *= 1.1
			if (self.ball[i].speed > 5) :
				self.ball[i].speed = 5
			i += 1

def start_game(num):
	logging.info(f"waiting list {len(waiting_list)}")
	if len(waiting_list) == num:
		players = []
		i = 0
		for player in waiting_list:
			player.gameNumber = int(i / 2)
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
				if game.players[playerID].pad_x  < 16.5:
					game.players[playerID].pad_x += 0.8
					logging.info("right move")
					if game.players[playerID].pad_x  > 16.0 :
							game.players[playerID].pad_x = 16
				if game.players[playerID].pad_x  > -16.5:
					game.players[playerID].pad_x -= 0.8
					logging.info("right move")
					if game.players[playerID].pad_x  < -16.0:
							game.players[playerID].pad_x = -16
			elif action == "left":
				if game.players[playerID].pad_x  > -16.5:
					game.players[playerID].pad_x -= 0.8
					logging.info("left move")
					if game.players[playerID].pad_x  < -16.0:
							game.players[playerID].pad_x = -16
				if game.players[playerID].pad_x  < 16.5:
					game.players[playerID].pad_x += 0.8
					logging.info("left move")
					if game.players[playerID].pad_x  > 16.0 :
						game.players[playerID].pad_x = 16
		time.sleep(0.05)
		i = 0
		while i < 4 :
			game.ball[i].x += game.ball[i].direction_x * 0.4 * game.ball[i].speed
			game.ball[i].z += game.ball[i].direction_z * 0.4 * game.ball[i].speed
			i += 1
		game.wallCollideTwoPlayer()
		game.rebound_x(0)
		game.rebound_x(1)
		game.send_all("gameState", game.to_json())
		for player in game.players:
			if player.score  > 9 :
				if game.next_game() == False:
					game.end_game()
				return


# _____________________
# tournamentList= {} 		
# game_list_tournament = []										# make a map please
# def start_gameTournament(name, size):
# 	if tournamentList.find(name) == False :
# 			tournamentList.append(Tournament(size, name))
# 	else :
# 			target =  tournamentList.find(name)
# 	if target.full:
# 		# pass
# 		it = 0
# 		tmp = []
# 		while it < target.size + 1 :
# 			tmp[0] = target.players[it]
# 			tmp[1] = target.players[it + 1]
# 			it += 2
# 			game_list_tournament.append(Game(tmp))
# 		target.size /= 2
# 		return
# 	else :
# 		return


# class Tournament :
# 	players = []
# 	size = 0
# 	name = "default"

# 	def __init__(self, size, name):
# 		self.size = size
# 		self.name = name
# 		pass
	
# 	def add(self, player):
# 		self.players.append(player)
	
# 	def full(self):
# 		if (len(self.players) == self.size):
# 			return True
# 		return False
# _______________________

class websocket_tournament(WebsocketConsumer):

	def connect(self):
		# ft_getGameType(self) 								?????????????????????????
		
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