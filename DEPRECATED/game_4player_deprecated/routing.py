from django.urls import re_path, path

from . import consumers

websocket_urlpatterns = [
	path('game_4player', consumers.websocket_client.as_asgi()),
]