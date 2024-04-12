from django.urls import re_path, path
from . import consumers

websocket_urlpatterns = [
	re_path(r'^game/(?P<type>[\w\-]+)/?$', consumers.WebsocketClient.as_asgi()),
]