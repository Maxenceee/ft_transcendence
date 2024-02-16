
from channels.generic.websocket import WebsocketConsumer
import json
import logging

class websocket_client(WebsocketConsumer):
	def connect(self):
		logging.info("server says connected")
		self.accept()

	def playerMove(self) :
		# logging.info(type(self.data['keyCode']['Key68']))
		if self.data['keyCode']['Key68'] == 1 :
			self.data['P1position']['x'] += 2/3
		if self.data['keyCode']['Key65'] == 1 :
			self.data['P1position']['x'] -= 2/3
		if self.data['keyCode']['Key39'] == 1 :
			self.data['P2position']['x'] -= 2/3
		if self.data['keyCode']['Key37'] == 1 :
			self.data['P2position']['x'] += 2/3
		
	def receive(self, text_data=None, bytes_data=None):
		# logging.info("server says client message received: " + text_data)
		tmp = json.loads(text_data)
		# logging.info(tmp)
		self.data = tmp['data']	
		if tmp['type'] == 1:
			a = 1
		elif tmp['type'] == 2:
			self.playerMove()
		# if tmp["type"] == 2:
		# 	self.a += 1
		# 	tmp["data"] = self.a
		# 	self.send(json.dumps(tmp))
		self.send(json.dumps(self.data))
	

		
	def disconnect(self, code):
		print("server says disconnected")