from channels.generic.websocket import WebsocketConsumer
from index.models import *

global status_manager

class StatusManager():
	def __init__(self):
		self.list_users = {}

	def add_user(self, user, socket):
		user.is_online = True
		user.save()
		self.user_list[user] = socket
		for user.foloower in user.foloowers.all():
			if user.foloower in self.user_list:
				self.user_list[user.foloower].send(json.load({'user': self.user_list[user.foloower].id, 'status': 'online'}))
	
	def remove_user(self, user):
		user.is_online = False
		user.save()
		del self.user_list[user]
		for user.foloower in user.foloowers.all():
			if user.foloower in self.user_list:
				self.user_list[user.foloower].send(json.load({'user': self.user_list[user.foloower].id, 'status': 'offline'}))

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
		status_manager.add_user(self.user, self)

	def receive(self, text_data=None, bytes_data=None):
		pass

	def disconnect(self, code):
		status_manager.remove_user(self.user)

status_manager = StatusManager()