from django.urls import re_path, path
from channels.generic.websocket import WebsocketConsumer

from . import consumers

class DenyConsumer(WebsocketConsumer):
	def connect(self):
		self.close()

websocket_urlpatterns = [
	path('user', consumers.websocket_client.as_asgi()),
	re_path(r'.*', DenyConsumer.as_asgi())
]