
import random
from channels.generic.websocket import WebsocketConsumer
import json
import logging

class websocket_client(WebsocketConsumer):
	def connect(self):
		logging.info("server says connected")
		self.accept()

	def playerMove(self) :
		# logging.info(type(self.data['keyCode']['Key68']))
		if self.data['keyCode']['Key68'] == 1 and self.data['P1position']['x']  < 16.1 :
			self.data['P1position']['x'] += 1.1
			self.data['keyCode']['Key68'] = 0
		if self.data['keyCode']['Key65'] == 1 and self.data['P1position']['x']  > -16.1 :
			self.data['P1position']['x'] -= 1.1
			self.data['keyCode']['Key65'] = 0
		if self.data['keyCode']['Key39'] == 1 and self.data['P2position']['x']  > -16.1 :
			self.data['P2position']['x'] -= 1.1
			self.data['keyCode']['Key39'] = 0
		if self.data['keyCode']['Key37'] == 1 and self.data['P2position']['x']  < 16.1 :
			self.data['P2position']['x'] += 1.1
			self.data['keyCode']['Key37'] = 0
		
	
	def wallCollideTwoPlayer(self):
		if self.data['ball']['x'] < -17 :
			self.data['ballDirection']['x'] *= -1
		elif self.data['ball']['x'] > 17:
			self.data['ballDirection']['x'] *= -1
		if self.data['ball']['z'] < -29:
			self.data['ball']['x'] = 0
			self.data['ball']['z'] = 0 
			self.data['ball']['y'] = 0	
			self.data['score']['scoreP2'] += 1
			self.data['ballDirection']['z'] *= -1
			self.data['ballDirection']['x'] =  random.uniform(-1, 1)
			self.data['updateScore'] = 1
			self.data['moveSpeed'] = 1.05
			
		elif self.data['ball']['z'] > 29 :
			self.data['score']['scoreP1'] += 1
			self.data['ball']['x'] = 0
			self.data['ball']['z'] = 0 
			self.data['ball']['y'] = 0
			self.data['ballDirection']['z'] *= -1
			self.data['ballDirection']['x'] =  random.uniform(-1, 1)
			self.data['updateScore'] = 1
			self.data['moveSpeed'] = 1.05
		if (self.data['moveSpeed'] > 5) :
			self.data['moveSpeed'] = 5
		return self.data
	


	def reboundP1(self):
		if self.data['ball']['z'] > 27 and (self.data['ball']['x'] < (self.data['P1position']['x'] + 4)  and self.data['ball']['x'] > (self.data['P1position']['x'] - 4)):
			self.data['ballDirection']['z'] *= -1	
			self.data['moveSpeed'] += 0.1
		if (self.data['moveSpeed'] > 5) :
			self.data['moveSpeed'] = 5
		return self.data
		
	def reboundP2(self):
		if self.data['ball']['z'] < -27 and (self.data['ball']['x'] < (self.data['P2position']['x'] + 4)  and self.data['ball']['x'] > (self.data['P2position']['x'] - 4)):
			self.data['ballDirection']['z'] *= -1
			self.data['moveSpeed'] += 0.1
		if (self.data['moveSpeed'] > 5) :
			self.data['moveSpeed'] = 5
		return self.data
		
	def receive(self, text_data=None, bytes_data=None):
		# logging.info("server says client message received: " + text_data)
		tmp = json.loads(text_data)
		# logging.info(tmp)
		if not hasattr(self, 'number'):
				self.number = 0 
		if not hasattr(self, 'data'): 
			self.data = tmp['data']
		if self.data['number'] < self.number :
				return
		if tmp['data']['keyCode'] != self.data['keyCode']:
			self.data['keyCode'] = tmp['data']['keyCode']
		# if tmp['type'] == 1:
		# 	a = 1
		# elif tmp['type'] == 2:
		# if self.data['score']['scoreP1'] > 10 or self.data['score']['scoreP2'] > 10 :
			# return
		self.playerMove()
		self.data = self.reboundP1()
		self.data = self.reboundP2()
		# logging.info("before")
		# logging.info(self.data['ball']['x'])
		self.data['ball']['x'] += ( self.data['ballDirection']['x'] ) * 0.2 * self.data['moveSpeed'] 
		self.data['ball']['z'] += ( self.data['ballDirection']['z'] ) * 0.2 * self.data['moveSpeed']  
		# logging.info("after")
		# logging.info(self.data['ball']['x'])
		self.data['updateScore'] = 0
		self.data = self.wallCollideTwoPlayer()
		self.number+=1
		self.data['number'] = self.number
		self.send(json.dumps(self.data))
		# if tmp["type"] == 2:
		# 	self.a += 1
		# 	tmp["data"] = self.a
		# 	self.send(json.dumps(tmp))

	

		
	def disconnect(self, code):
		print("server says disconnected")