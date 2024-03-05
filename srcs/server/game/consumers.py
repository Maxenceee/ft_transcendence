import random
from channels.generic.websocket import WebsocketConsumer
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

global timeStart 
timeStart = 0
global pouet; 
global ballPosition
global score
score = dict()
global ballDirection
ballPosition = dict()
ballDirection = {'x', 'y'}
pouet = [0]

class Game:
	def __init__(self, players) -> None:
		logging.info("new game created")
		self.players = players
		self.pool_id = makeid(15)
		for p in self.players:
			p.pool_id = self.pool_id
			p.pool = self
			# p.number = number
			# number += 1

	def end_game(self):
		# self.send_all(json.dump({"endgame": True}))
		for p in self.players:
			p.close()
		
		game_list.remove(self)


	def send_all(self, data):
		tmp = json.dumps(data)
		for p in self.players:
			if type(data) == type(dict()) and self.pool_id == data['gameID'] :
				p.send(tmp)

def start_game(num):
	logging.info(f"waiting list {waiting_list}")
	if len(waiting_list) == num:
		out = []
		for m in waiting_list:
			out += [m] if not isinstance(m, list) else m
		for m in out:
			waiting_list.remove(m)
		logging.info(f"players for game {out}")
		game_list.append(Game(out))
	else:
		logging.info("pas assez de joueurs")

class websocket_client(WebsocketConsumer):
	number = 0


	def connect(self):
		logging.info("server says connected")
		self.accept()
		waiting_list.append(self)
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
		global timeStart
		global ballPosition
		global ballDirection
		global score

		if timeStart == 0 :
			timeStart = time.time()
		tmp = json.loads(text_data)
		# logging.info(tmp)
		if tmp['type'] == "end":
				self.pool.end_game()
				return 
		if not hasattr(self, 'pool_id'):
			logging.info("no id")
			tmp['playerNumber'] = pouet[0]
			pouet[0] += 1
			return
		if tmp['type'] == 2:
			tmp = dict()
			tmp['playerNumber'] = pouet[0]
			tmp['type'] = "id"
			tmp['gameID'] = self.pool_id
			tmp['P1position'] = dict()
			tmp['P1position']['x'] = 0
			tmp['P2position'] = dict()
			tmp['P2position']['x'] = 0
			tmp['number'] = [2]
			self.send(json.dumps(tmp))
			pouet[0] += 1
			logging.info(f"pouet = {tmp}")
			return
		if not hasattr(self, 'data'):
			self.data = tmp['data']
			try:
				score = tmp['data']['score']
				ballPosition = self.data['ball']
				ballDirection = self.data['ballDirection']
				self.data['P1position']['x'] = 0
				self.data['P2position']['x'] = 0
				self.data['gameID'] = self.pool_id
			except :
				self.data = self.data
		if tmp['data']['gameID'] != self.pool_id :
				logging.info(f"send {self.pool_id}")
				logging.info(self.data['gameID'])
				return
		if self.data['number'][1] > tmp['data']['number'][1] and  tmp['data']['playerNumber'] % 2 == 1:
				return
		if self.data['number'][0] > tmp['data']['number'][0]and  tmp['data']['playerNumber'] % 2 == 0 :
				return
		
		# logging.info(tmp['data']['number'])
		# logging.info(self.data['P1position']['x'])
		# if hasattr(tmp, ['data']['keyCode']) and tmp['data']['keyCode'] != self.data['keyCode']:
			# self.data['keyCode'] = tmp['data']['keyCode']
		# if hasattr(tmp['data'], 'playerNumber') and tmp['data']['playerNumber'] == 1 :
		self.data = self.reboundP2()
		if tmp['data']['updateScore'] != 0 :
			self.data['updateScore']  -= 1
		if tmp['type'] == 1 :
			# self.playerMove4P()
			self.data = self.wallCollideFourPlayer()
			self.data = self.reboundP3()
			self.data = self.reboundP4()
		else:
			# self.data = self.playerMove2P()
			self.data = self.wallCollideTwoPlayer()
		# if int(str(self.data['playerNumber'])) % 2 == 1 :
		if 	self.data['number'][0] < tmp['data']['number'][0] :
					self.data['number'][0] = tmp['data']['number'][0]
		if self.data['P1position']['x'] != tmp['data']['P1position']['x'] :
			self.data['P1position']['x'] = tmp['data']['P1position']['x']   # tmp
		# if int(str(self.data['playerNumber'])) % 2 == 0 :
		if self.data['number'][1] < tmp['data']['number'][1] :
				self.data['number'][1] = tmp['data']['number'][1]
		if self.data['P2position']['x'] != tmp['data']['P2position']['x'] :
			self.data['P2position']['x'] = tmp['data']['P2position']['x']   # tmp
		# logging.info(self.data['P2position']['x'])
		self.data = self.reboundP1()
		if ballPosition['z'] == tmp['data']['ball']['z'] :
			ballPosition['z'] += self.data['ballDirection']['z'] * 0.4 * self.data['moveSpeed']
		if ballPosition['x'] == tmp['data']['ball']['x'] :
			ballPosition['x'] += self.data['ballDirection']['x'] * 0.4 * self.data['moveSpeed'] 
		if timeStart + 0.05 < time.time():
			self.data['ball'] = ballPosition
			self.data['ballDirection'] = ballDirection
			self.pool.send_all(self.data)
			timeStart = time.time()

		
	def disconnect(self, code):
		print("server says disconnected")
		if waiting_list.count(self):
			waiting_list.remove(self)

	# async def clock(self) :
	# 	i = 0
	# 	i+=1
	# 	while True :
	# 		await asyncio.sleep(0.05)
	# 		logging.info("send data")
	# 		await self.pool.send_all(json.dumps(tmp))