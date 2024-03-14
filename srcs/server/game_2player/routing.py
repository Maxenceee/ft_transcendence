from django.urls import re_path, path

from . import consumers

websocket_urlpatterns = [
	path('game_2player', consumers.websocket_client.as_asgi()),
]