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
	ball = Ball()


	def __init__(self, players) -> None:
		logging.info("new game created")
		self.id = makeid(15)
		self.lastframe = time.time()
		self.players = players

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

	def send_all(self, data):
		for player in self.players:
			player.socket.send(data)

	def to_json(self):
		#{"player": "[{"id":1,"x": 0, "z": 0}, {"id":2,"x": 0, "z": 0}]", "ball": {"x": 0, "z": 0}, "score": {"1": 0, "2": 0}, "moveSpeed": 1.05}
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
	
	def wallCollideTwoPlayer(self):
		global ballPosition
		global ballDirection
		global score

		if ballPosition['x'] < -17 :
			ballDirection['x'] = 1 #naive version
		elif ballPosition['x'] > 17:
			ballDirection['x'] = -1 #naive version
		if ballPosition['z'] < -29:
			score['scoreP2'] += 1
			ballPosition['x'] = 0
			ballPosition['z'] = 0 
			ballPosition['y'] = 0
			ballDirection['z'] *= -1
			# if ( hasattr(self.data, 'playerNumber') and self.data['playerNumber'] == 1) :
			ballDirection['x'] = random.uniform(math.pi * -1 + 1, math.pi - 1)
			# else :
				# ballDirection = self.data['ballDirection']
			self.data['updateScore'] = 6
			self.data['moveSpeed'] = 1.05
			self.pool.send_all(json.dumps(self.data))
			logging.info(self.data['score'])
			
		elif ballPosition['z'] > 29:
			score['scoreP1'] +=1
			ballPosition['x'] = 0
			ballPosition['z'] = 0 
			ballPosition['y'] = 0
			ballDirection['z'] *= -1
			# if hasattr(self.data, 'playerNumber') and (self.data['playerNumber'] == 1) :
			ballDirection['x'] = random.uniform(math.pi * -1 + 1, math.pi - 1)
			# else :
				# ballDirection = self.data['ballDirection']
			self.data['updateScore'] = 6
			self.data['moveSpeed'] = 1.05
			self.pool.send_all(json.dumps(self.data))
			logging.info(self.data['score'])
		if (self.data['moveSpeed'] > 5) :
			self.data['moveSpeed'] = 5
		self.data['score'] = score
		return self.data
	
	def wallCollideFourPlayer(self):
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

	def reboundP1(self):
		if self.data['ball']['z'] > 27 and (self.data['ball']['x'] < (self.data['P1position']['x'] + 4)  and self.data['ball']['x'] > (self.data['P1position']['x'] - 4)):
			self.data['ballDirection']['z'] = -1	
			self.data['moveSpeed'] += 0.1
		if (self.data['moveSpeed'] > 5) :
			self.data['moveSpeed'] = 5
		return self.data
		
	def reboundP2(self):
		if self.data['ball']['z'] < -27 and (self.data['ball']['x'] < (self.data['P2position']['x'] + 4)  and self.data['ball']['x'] > (self.data['P2position']['x'] - 4)):
			self.data['ballDirection']['z'] = 1
			self.data['moveSpeed'] += 0.1
		if (self.data['moveSpeed'] > 5) :
			self.data['moveSpeed'] = 5
		return self.data
	
	def reboundP3(self):
		if self.data['ball']['x'] < -27 and (self.data['ball']['z'] < (self.data['P3position']['z'] + 4)  and self.data['ball']['z'] > (self.data['P3position']['z'] - 4)):
			self.data['ballDirection']['x'] = 1	
			self.data['moveSpeed'] += 0.1
			logging.info(self.data['ballDirection']['x'])
		if (self.data['moveSpeed'] > 5) :
			self.data['moveSpeed'] = 5
		return self.data
		
	def reboundP4(self):
		if self.data['ball']['x'] > 27 and (self.data['ball']['z'] < (self.data['P4position']['z'] + 4)  and self.data['ball']['z'] > (self.data['P4position']['z'] - 4)):
			self.data['ballDirection']['x'] *= -1
			self.data['moveSpeed'] += 0.1
			logging.info(self.data['ballDirection']['x'])
		if (self.data['moveSpeed'] > 5) :
			self.data['moveSpeed'] = 5
		return self.data
		
	def receive(self, text_data=None, bytes_data=None):
		if not hasattr(self, "data"):
			find = 0
			for current in game_list:
				current_players = current.players
				for player in current_players:
					if player.socket == self:
						self.playerID = current_players.index(player)
						find = 1
						break
				if find == 1:
					break
			if find == 0:
				return
			else:
					self.data = current
		#debug
		receive_package = json.loads(text_data)
		if receive_package['type'] == "end":
				self.data.end_game()
				return 


		if receive_package['type'] == "init":
			logging.info("send")
			self.data.send_all(json.dumps(self.data.to_json())) #not work fix json
			return 
		
		# if self.playerID:
		if self.data.last_frame + 1 < time.time():
			self.data.ball.x += self.data.ball.direction_x * 0.4 * self.data.ball.speed
			self.data.ball.z += self.data.ball.direction_z * 0.4 * self.data.ball.speed
			self.data.send_all(json.dumps(self.data.to_json()))
			self.data.last_frame = time.time()
		return
	
		self.data = self.reboundP2()
		if receive_package['data']['updateScore'] != 0 :
			self.data['updateScore']  -= 1
		if receive_package['type'] == 1 :
			# self.playerMove4P()
			self.data = self.wallCollideFourPlayer()
			self.data = self.reboundP3()
			self.data = self.reboundP4()
		else:
			# self.data = self.playerMove2P()
			self.data = self.wallCollideTwoPlayer()
		# if int(str(self.data['playerNumber'])) % 2 == 1 :
		if 	self.data['number'][0] < receive_package['data']['number'][0] :
					self.data['number'][0] = receive_package['data']['number'][0]
		if self.data['P1position']['x'] != receive_package['data']['P1position']['x'] :
			self.data['P1position']['x'] = receive_package['data']['P1position']['x']   # receive_package
		# if int(str(self.data['playerNumber'])) % 2 == 0 :
		if self.data['number'][1] < receive_package['data']['number'][1] :
				self.data['number'][1] = receive_package['data']['number'][1]
		if self.data['P2position']['x'] != receive_package['data']['P2position']['x'] :
			self.data['P2position']['x'] = receive_package['data']['P2position']['x']   # receive_package
		# logging.info(self.data['P2position']['x'])
		self.data = self.reboundP1()
		if ballPosition['z'] == receive_package['data']['ball']['z'] :
			ballPosition['z'] += self.data['ballDirection']['z'] * 0.4 * self.data['moveSpeed']
		if ballPosition['x'] == receive_package['data']['ball']['x'] :
			ballPosition['x'] += self.data['ballDirection']['x'] * 0.4 * self.data['moveSpeed'] 


		
	def disconnect(self, code):
		print("server says disconnected")
		if hasattr(self, "data"):
			self.data.end_game()
		else:
			for player in waiting_list:
				if player.socket == self:
					waiting_list.remove(player)