from django.urls import re_path, path

from . import consumers

websocket_urlpatterns = [
	path('tournament', consumers.websocket_tournament.as_asgi()),
]