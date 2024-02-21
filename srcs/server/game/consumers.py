import random
from channels.generic.websocket import WebsocketConsumer
import json
import logging

def makeid(len):
	str = "abcdefghijklmnopqrstuvwxyz0123456789"
	res = ""
	for _ in range(len):
		res += str[random.randint(0, 35)]
	return res

waiting_list = []
game_list = []
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
		self.send_all(json.dump({"endgame": True}))
		for p in self.players:
			p.close()
		game_list.remove(self)

	def send_all(self, data):
		for p in self.players:
			p.send(data)

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
		if self.data['ball']['x'] < -17 :
			self.data['ballDirection']['x'] *= -1 #naive version
		elif self.data['ball']['x'] > 17:
			self.data['ballDirection']['x'] *= -1 #naive version
		if self.data['ball']['z'] < -29:
			self.data['ball']['x'] = 0
			self.data['ball']['z'] = 0 
			self.data['ball']['y'] = 0	
			self.data['score']['scoreP2'] += 1
			self.data['ballDirection']['z'] *= -1
			if ( hasattr(self.data, 'playerNumber') and self.data['playerNumber'] == 1) :
				self.data['ballDirection']['x'] = random.uniform(-1, 1)
			self.data['updateScore'] = 1
			self.data['moveSpeed'] = 1.05
			
		elif self.data['ball']['z'] > 29 :
			self.data['score']['scoreP1'] += 1
			self.data['ball']['x'] = 0
			self.data['ball']['z'] = 0 
			self.data['ball']['y'] = 0
			self.data['ballDirection']['z'] *= -1
			if hasattr(self.data, 'playerNumber') and (self.data['playerNumber'] == 1) :
				self.data['ballDirection']['x'] = random.uniform(-1, 1)
			self.data['updateScore'] = 1
			self.data['moveSpeed'] = 1.05
		if (self.data['moveSpeed'] > 5) :
			self.data['moveSpeed'] = 5
		return self.data
	
	def wallCollideFourPlayer(self):
		if self.data['ball']['x'] < -29 :
			self.data['ball']['x'] = 0
			self.data['ball']['z'] = 0 
			self.data['ball']['y'] = 0	
			self.data['score']['scoreP3'] -= 1
			self.data['ballDirection']['z'] = random.uniform(-1, 1)
			self.data['ballDirection']['x'] = random.uniform(-1, 1)
			self.data['updateScore'] = 1
			self.data['moveSpeed'] = 1.05
		elif self.data['ball']['x'] > 29:
			self.data['ball']['x'] = 0
			self.data['ball']['z'] = 0 
			self.data['ball']['y'] = 0	
			self.data['score']['scoreP4'] -= 1
			self.data['ballDirection']['z'] = random.uniform(-1, 1)
			self.data['ballDirection']['x'] = random.uniform(-1, 1)
			self.data['updateScore'] = 1
			self.data['moveSpeed'] = 1.05
		if self.data['ball']['z'] < -29:
			self.data['ball']['x'] = 0
			self.data['ball']['z'] = 0 
			self.data['ball']['y'] = 0	
			self.data['score']['scoreP2'] -= 1
			self.data['ballDirection']['z'] = random.uniform(-1, 1)
			self.data['ballDirection']['x'] = random.uniform(-1, 1)
			self.data['updateScore'] = 1
			self.data['moveSpeed'] = 1.05
			
		elif self.data['ball']['z'] > 29 :
			self.data['score']['scoreP1'] -= 1
			self.data['ball']['x'] = 0
			self.data['ball']['z'] = 0 
			self.data['ball']['y'] = 0
			self.data['ballDirection']['z'] = random.uniform(-1, 1)
			self.data['ballDirection']['x'] = random.uniform(-1, 1)
			self.data['updateScore'] = 1
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
	# self.data['keyCode']['Key68'] = 0
	# self.data['keyCode']['Key65'] = 0
	# self.data['keyCode']['Key39'] = 0
	# self.data['keyCode']['Key37'] = 0
	# self.data['keyCode']['Key81'] = 0
	# self.data['keyCode']['Key69'] = 0
	# self.data['keyCode']['Key67'] = 0
	# self.data['keyCode']['Key90'] = 0	
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
		
		tmp = json.loads(text_data)
		# logging.info(tmp)
		if tmp['type'] == 2 :
				self.send(json.dumps(pouet[0]))
				pouet[0] += 1
				return
		if not hasattr(self, 'pool_id'):
			return
		# if not hasattr(self, 'playerNb'):
		# 	self.playerNb = 1
		# if not hasattr(self, 'number'):
		# 		self.number = 0
		# if not hasattr(self.itteration,'self.pool_id') :
				# self.itteration[self.pool_id] = 0 
		if not hasattr(self, 'data'): 
			self.data = tmp['data']
			# self.data['playerID'] = self.pool_id
		if self.data['number'] < tmp['data']['number'] :
				return
		# logging.info(self.data['P1position']['x'])
		if tmp['data']['keyCode'] != self.data['keyCode']:
			self.data['keyCode'] = tmp['data']['keyCode']
		# if hasattr(tmp['data'], 'playerNumber') and tmp['data']['playerNumber'] == 1 :
		self.data['P1position']['x'] = tmp['data']['P1position']['x']   # tmp
		# if hasattr(tmp['data'], 'playerNumber') and tmp['data']['playerNumber'] == 2 :
		self.data['P2position']['x'] = tmp['data']['P2position']['x']   # tmp
		self.data = self.reboundP1()
		self.data = self.reboundP2()
		self.data['updateScore'] = 0
		if tmp['type'] == 1 :
			self.playerMove4P()
			self.data = self.wallCollideFourPlayer()
			self.data = self.reboundP3()
			self.data = self.reboundP4()
		else:
			# self.data = self.playerMove2P()
			self.data = self.wallCollideTwoPlayer()
		
		self.data['ball']['z'] += self.data['ballDirection']['z'] * 0.4 * self.data['moveSpeed']  
		self.data['ball']['x'] += self.data['ballDirection']['x'] * 0.4 * self.data['moveSpeed'] 
		self.number += 1
		self.data['number'] = self.number
		
		# if self.data['playerId'] == self.pool_id :
		# 	self.data['number'] = self.itteration[self.pool_id]
		# logging.info(self.data['P1position']['x'])
		# logging.info(self.data['number'])
		self.pool.send_all(json.dumps(self.data))
		
	def disconnect(self, code):
		print("server says disconnected")
		if waiting_list.count(self):
			waiting_list.remove(self)