import random
from channels.generic.websocket import WebsocketConsumer
from index.models import *
import json
import logging
import asyncio
import time
import math

def makeid(len):
	str = "abcdefghijklmnopqrstuvwxyz0123456789"
	res = ""
	for _ in range(len):
		res += str[random.randint(0, 35)]
	return res

waiting_list = []
game_list = []

# global timeStart 
# timeStart = 0
# global idPlayer; 
# global ballPosition
# global score
# score = dict()
# global ballDirection
# ballPosition = dict()
# ballDirection = {'x', 'y'}
# idPlayer = [0]

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

class Game:
	id = ""
	last_frame = 0
	players = []


	def __init__(self, players) -> None:
		logging.info("new game created")
		self.id = makeid(15)
		self.lastframe = time.time()
		self.players = players
		self.ball = Ball()

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
		logging.info("game ended")
		#remove from game list

	def send_all(self, data):
		for player in self.players:
			player.socket.send(data)

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
		logging.info(f"game created")
	else:
		logging.info("pas assez de joueurs")


class websocket_client(WebsocketConsumer):

	def connect(self):
		logging.info("new player connected")
		self.accept()
		waiting_list.append(Player("player_id", self))
		start_game(2)

	def playerMove2P(self) :
		# logging.info(type(self.data['keyCode']['Key68']))
		if self.data['keyCode']['Key68'] == 1 and self.data['P1position']['x']  < 16.1 :
			self.data['P1position']['x'] += 1.1
		if self.data['keyCode']['Key65'] == 1 and self.data['P1position']['x']  > -16.1 :
			self.data['P1position']['x'] -= 1.1
		if self.data['keyCode']['Key39'] == 1 and self.data['P2position']['x']  > -16.1 :
			self.data['P2position']['x'] -= 1.1
		if self.data['keyCode']['Key37'] == 1 and self.data['P2position']['x']  < 16.1 :
			self.data['P2position']['x'] += 1.1
		# self.data['keyCode']['Key65'] = 0
		# self.data['keyCode']['Key68'] = 0
		# self.data['keyCode']['Key39'] = 0
		# self.data['keyCode']['Key37'] = 0
		return self.data
	
	def wallCollideTwoPlayer(self): #to change

		if self.data.ball.x < -17 :
			self.data.ball.direction_x = 1 #naive version
		elif self.data.ball.x > 17:
			self.data.ball.direction_x = -1 #naive version
		if self.data.ball.z < -29:
			self.data.players[0].score += 1
			self.data.ball.x = 0
			self.data.ball.z = 0 
			self.data.ball.y = 0
			self.data.ball.direction_z *= -1
			# if ( hasattr(self.data, 'playerNumber') and self.data['playerNumber'] == 1) :
			self.data.ball.direction_x = random.uniform(math.pi * -1 + 1, math.pi - 1)
			# else :
				# ballDirection = self.data['ballDirection']
			self.data.ball.speed = 1.05
			self.pool.send_all(json.dumps(self.data))

		elif self.data.ball.z > 29:
			self.data.players[1].score +=1
			self.data.ball.x = 0
			self.data.ball.z = 0 
			self.data.ball.y = 0
			self.data.ball.direction_z *= -1
			# if hasattr(self.data, 'playerNumber') and (self.data['playerNumber'] == 1) :
			self.data.ball.direction_x = random.uniform(math.pi * -1 + 1, math.pi - 1)
			# else :
				# ballDirection = self.data['ballDirection']
			self.data.ball.speed = 1.05
			self.pool.send_all(json.dumps(self.data))
		if (self.data.ball.speed > 5) :
			self.data.ball.speed = 5
		return self.data
	
	def wallCollideFourPlayer(self): #to change
		if self.data['ball']['x'] < -29 :
			self.data['ball']['x'] = 0
			self.data['ball']['z'] = 0 
			self.data['ball']['y'] = 0	
			self.data['score']['scoreP3'] -= 1
			self.data['ballDirection']['z'] = random.uniform(-1, 1)
			self.data['ballDirection']['x'] = random.uniform(-1, 1)
			self.data['updateScore'] = 2
			self.data['moveSpeed'] = 1.05
		elif self.data['ball']['x'] > 29:
			self.data['ball']['x'] = 0
			self.data['ball']['z'] = 0 
			self.data['ball']['y'] = 0	
			self.data['score']['scoreP4'] -= 1
			self.data['ballDirection']['z'] = random.uniform(-1, 1)
			self.data['ballDirection']['x'] = random.uniform(-1, 1)
			self.data['updateScore'] = 2
			self.data['moveSpeed'] = 1.05
		if self.data['ball']['z'] < -29:
			self.data['ball']['x'] = 0
			self.data['ball']['z'] = 0 
			self.data['ball']['y'] = 0	
			self.data['score']['scoreP2'] -= 1
			self.data['ballDirection']['z'] = random.uniform(-1, 1)
			self.data['ballDirection']['x'] = random.uniform(-1, 1)
			self.data['updateScore'] = 2
			self.data['moveSpeed'] = 1.05
			
		elif self.data['ball']['z'] > 29 :
			self.data['score']['scoreP1'] -= 1
			self.data['ball']['x'] = 0
			self.data['ball']['z'] = 0 
			self.data['ball']['y'] = 0
			self.data['ballDirection']['z'] = random.uniform(-1, 1)
			self.data['ballDirection']['x'] = random.uniform(-1, 1)
			self.data['updateScore'] = 2
			self.data['moveSpeed'] = 1.05
		if (self.data['moveSpeed'] > 5) :
			self.data['moveSpeed'] = 5
		return self.data
	
	def playerMove4P(self) :
		# logging.info(type(self.data['keyCode']['Key68']))
		if self.data['keyCode']['Key68'] == 1 and self.data['P1position']['x']  < 26 :
			self.data['P1position']['x'] += 1.1
			
		if self.data['keyCode']['Key65'] == 1 and self.data['P1position']['x']  > -26 :
			self.data['P1position']['x'] -= 1.1
			
		if self.data['keyCode']['Key39'] == 1 and self.data['P2position']['x']  > -26 :
			self.data['P2position']['x'] -= 1.1
			
		if self.data['keyCode']['Key37'] == 1 and self.data['P2position']['x']  < 26 :
			self.data['P2position']['x'] += 1.1
			
		if self.data['keyCode']['Key81'] == 1 and self.data['P3position']['z']  < 26 :
			self.data['P3position']['z'] += 1.1
			
		if self.data['keyCode']['Key69'] == 1 and self.data['P3position']['z']  > -26:
			self.data['P3position']['z'] -= 1.1
			
		if self.data['keyCode']['Key67'] == 1 and self.data['P4position']['z']  < 26 :
			self.data['P4position']['z'] += 1.1
			
		if self.data['keyCode']['Key90'] == 1 and self.data['P4position']['z']  > -26 :
			self.data['P4position']['z'] -= 1.1
		return self.data

	def rebound_x(self, player_number):
		if self.data.ball.z < -27 and (self.data.ball.x < (self.data.players[player_number].pad_x + 4)  and self.data.ball.x> (self.data.players[player_number].pad_x - 4)):
			self.data.ball.direction_z = 1
			self.data.ball.speed += 0.1
		if (self.data.ball.speed > 5) :
			self.data.ball.speed = 5

	def rebound_z(self, player_number):
		if self.data.ball.z < -27 and (self.data.ball.x < (self.data.players[player_number].pad_z + 4)  and self.data.ball.x> (self.data.players[player_number].pad_z - 4)):
			self.data.ball.direction_z = 1
			self.data.ball.speed += 0.1
		if (self.data.ball.speed > 5) :
			self.data.ball.speed = 5
		return self.data
	
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
		#debug
		receive_package = json.loads(text_data)

		if receive_package['type'] == "end":
				self.data.end_game()
				return 


		if receive_package['type'] == "init":
			logging.info("send")
			self.data.send_all(json.dumps(self.data.to_json())) #not work fix json
			return

		self.wallCollideTwoPlayer()
		self.rebound_x(0)
		self.rebound_x(1)
		

		if self.data.last_frame + 0.05 < time.time():
			self.data.ball.x += self.data.ball.direction_x * 0.4 * self.data.ball.speed
			self.data.ball.z += self.data.ball.direction_z * 0.4 * self.data.ball.speed
			self.data.last_frame = time.time()
			self.data.send_all(json.dumps(self.data.to_json()))

		return

		if receive_package['type'] == 1 :
			# data = self.wallCollideFourPlayer()
			self.data = self.rebound_z(2)
			self.data = self.rebound_z(3)
		# else:
			# self.data = self.wallCollideTwoPlayer()

		#to change
		# if 	self.data['number'][0] < receive_package['data']['number'][0] :
					# self.data['number'][0] = receive_package['data']['number'][0]
		if self.data.players.players[0].pad_x != receive_package['data']['P1position']['x'] :
			self.data.players.players[0].pad_x = receive_package['data']['P1position']['x']  #tmp

		# if self.data['number'][1] < receive_package['data']['number'][1] :
				# self.data['number'][1] = receive_package['data']['number'][1]
		if self.data.players[1].pad_x != receive_package['data']['P2position']['x'] :
			self.data.players[1].pad_x = receive_package['data']['P2position']['x']   #tmp

		if self.data.ball.z == receive_package['data']['ball']['z'] :
			self.data.ball.z += self.data.ball.direction_z * 0.4 * self.data.ball.speed
		if self.data.ball.x == receive_package['data']['ball']['x'] :
			self.data.ball.x += self.data.ball.direction_x * 0.4 * self.data.ball.speed 
		#end of to change

		self.data.send_all(json.dumps(self.data.to_json()))

	def disconnect(self, code):
		print("server says disconnected")
		if hasattr(self, "data"):
			self.data.end_game()
		else:
			for player in waiting_list:
				if player.socket == self:
					waiting_list.remove(player)