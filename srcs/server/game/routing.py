from django.urls import re_path, path

from . import consumers

websocket_urlpatterns = [
	path('game', consumers.websocket_client.as_asgi()),
]