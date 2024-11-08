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
			user = User.objects.get(id=socket.user.id)
			user.is_online = True
			user.save()
	
	def remove_user(self, socket):
		self.user_list.remove(socket)
		i = 0
		for current in self.user_list:
			if current.user == socket.user:
				i += 1
		if i == 0:
			user = User.objects.get(id=socket.user.id)
			user.is_online = False
			user.save()

class websocket_client(WebsocketConsumer):
	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.user = None

	def connect(self):
		cookies = {}
		try :
			data = self.scope['headers']
		except:
			self.close()
			return
		for i in data:
			if b'cookie' in i:
				cookie = i[1].decode('utf-8')
				cookie = cookie.split(';')
				for j in cookie:
					j = j.strip()
					j = j.split('=')
					cookies[j[0]] = j[1]
		try:
			token = cookies['token']
		except:
			self.close()
			return
		if not Token.objects.filter(token=token).exists():
			self.close()
			return
		token = Token.objects.get(token=token)
		if token.is_valid:
			self.accept()
		else:
			self.close()
			return
		self.user = token.user
		status_manager.add_user(self)

	def receive(self, text_data=None, bytes_data=None):
		pass

	def disconnect(self, code):
		if self.user is not None:
			status_manager.remove_user(self)

status_manager = StatusManager()