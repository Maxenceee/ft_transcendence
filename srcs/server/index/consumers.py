from channels.generic.websocket import WebsocketConsumer
from index.models import *

class websocket_client(WebsocketConsumer):

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
		self.user = token.user

		self.user.is_online = True
		self.user.save()



	def receive(self, text_data=None, bytes_data=None):
		pass

	def disconnect(self, code):
		self.user.is_online = False
		self.user.save()