
import random
from channels.generic.websocket import WebsocketConsumer
import json
import logging

class websocket_client(WebsocketConsumer):
	def connect(self):
		logging.info("server says connected")
		self.accept()

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
		self.data['keyCode']['Key65'] = 0
		self.data['keyCode']['Key68'] = 0
		self.data['keyCode']['Key39'] = 0
		self.data['keyCode']['Key37'] = 0
		return self.data
		
	
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
	
	def wallCollideFourPlayer(self):
		if self.data['ball']['x'] < -29 :
			self.data['ball']['x'] = 0
			self.data['ball']['z'] = 0 
			self.data['ball']['y'] = 0	
			self.data['score']['scoreP3'] -= 1
			self.data['ballDirection']['z'] =random.uniform(-1, 1)
			self.data['ballDirection']['x'] =  random.uniform(-1, 1)
			self.data['updateScore'] = 1
			self.data['moveSpeed'] = 1.05
		elif self.data['ball']['x'] > 29:
			self.data['ball']['x'] = 0
			self.data['ball']['z'] = 0 
			self.data['ball']['y'] = 0	
			self.data['score']['scoreP4'] -= 1
			self.data['ballDirection']['z'] =random.uniform(-1, 1)
			self.data['ballDirection']['x'] =  random.uniform(-1, 1)
			self.data['updateScore'] = 1
			self.data['moveSpeed'] = 1.05
		if self.data['ball']['z'] < -29:
			self.data['ball']['x'] = 0
			self.data['ball']['z'] = 0 
			self.data['ball']['y'] = 0	
			self.data['score']['scoreP2'] -= 1
			self.data['ballDirection']['z'] =random.uniform(-1, 1)
			self.data['ballDirection']['x'] =  random.uniform(-1, 1)
			self.data['updateScore'] = 1
			self.data['moveSpeed'] = 1.05
			
		elif self.data['ball']['z'] > 29 :
			self.data['score']['scoreP1'] -= 1
			self.data['ball']['x'] = 0
			self.data['ball']['z'] = 0 
			self.data['ball']['y'] = 0
			self.data['ballDirection']['z'] =random.uniform(-1, 1)
			self.data['ballDirection']['x'] =  random.uniform(-1, 1)
			self.data['updateScore'] = 1
			self.data['moveSpeed'] = 1.05
		if (self.data['moveSpeed'] > 5) :
			self.data['moveSpeed'] = 5
		return self.data
	
	def playerMove4P(self) :
		# logging.info(type(self.data['keyCode']['Key68']))
		if self.data['keyCode']['Key68'] == 1 and self.data['P1position']['x']  < 26 :
			self.data['P1position']['x'] += 1.1
			self.data['keyCode']['Key68'] = 0
		if self.data['keyCode']['Key65'] == 1 and self.data['P1position']['x']  > -26 :
			self.data['P1position']['x'] -= 1.1
			self.data['keyCode']['Key65'] = 0
		if self.data['keyCode']['Key39'] == 1 and self.data['P2position']['x']  > -26 :
			self.data['P2position']['x'] -= 1.1
			self.data['keyCode']['Key39'] = 0
		if self.data['keyCode']['Key37'] == 1 and self.data['P2position']['x']  < 26 :
			self.data['P2position']['x'] += 1.1
			self.data['keyCode']['Key37'] = 0
		if self.data['keyCode']['Key81'] == 1 and self.data['P3position']['z']  < 26 :
			self.data['P3position']['z'] += 1.1
			self.data['keyCode']['Key81'] = 0
		if self.data['keyCode']['Key69'] == 1 and self.data['P3position']['z']  > -26:
			self.data['P3position']['z'] -= 1.1
			self.data['keyCode']['Key69'] = 0
		if self.data['keyCode']['Key67'] == 1 and self.data['P4position']['z']  < 26 :
			self.data['P4position']['z'] += 1.1
			self.data['keyCode']['Key67'] = 0
		if self.data['keyCode']['Key90'] == 1 and self.data['P4position']['z']  > -26 :
			self.data['P4position']['z'] -= 1.1
			self.data['keyCode']['Key90'] = 0
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
			self.data['ballDirection']['x'] *= -1	
			self.data['moveSpeed'] += 0.1
		if (self.data['moveSpeed'] > 5) :
			self.data['moveSpeed'] = 5
		return self.data
		
	def reboundP4(self):
		if self.data['ball']['x'] > 27 and (self.data['ball']['z'] < (self.data['P4position']['z'] + 4)  and self.data['ball']['z'] > (self.data['P4position']['z'] - 4)):
			self.data['ballDirection']['x'] *= -1
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
		self.data = self.reboundP1()
		self.data = self.reboundP2()
		self.data['updateScore'] = 0
		if tmp['type'] == 1 :
			self.playerMove4P()
			self.data = self.wallCollideFourPlayer()
			self.data = self.reboundP3()
			self.data = self.reboundP4()
		else:
			self.data = self.playerMove2P()
			self.data = self.wallCollideTwoPlayer()
		self.data['ball']['x'] += ( self.data['ballDirection']['x'] ) * 0.2 * self.data['moveSpeed'] 
		self.data['ball']['z'] += ( self.data['ballDirection']['z'] ) * 0.2 * self.data['moveSpeed']  
		self.number+=1
		self.data['number'] = self.number
		self.send(json.dumps(self.data))
	

		
	def disconnect(self, code):
		print("server says disconnected")







		