from channels.generic.websocket import WebsocketConsumer
from index.models import *

global status_manager

class StatusManager():
	def __init__(self):
		self.user_list = []

	def add_user(self, socket):
		self.user_list.append(socket)
		i = 0
		for current in self.user_list:
			if current.user == socket.user:
				i += 1
		if i == 1:
			for current in self.user_list:
				if socket.user in current.user.following.all():
					current.send(json.dumps({
						'user': socket.user.id,
						'status': 'online'
					}))
			user.is_online = True
			user.save()
	
	def remove_user(self, socket):
		self.user_list.remove(socket)
		i = 0
		for current in self.user_list:
			if current.user == socket.user:
				i += 1
		if i == 0:
			for current in self.user_list:
				if socket.user in current.user.following.all():
					current.send(json.dumps({
						'user': socket.user.id,
						'status': 'offline'
					}))
			user.is_online = False
			user.save()

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
		status_manager.add_user(self)

	def receive(self, text_data=None, bytes_data=None):
		pass

	def disconnect(self, code):
		status_manager.remove_user(self)

status_manager = StatusManager()