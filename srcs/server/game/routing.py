from django.urls import re_path, path

from . import consumers

websocket_urlpatterns = [
    path('socket', consumers.websocket_client.as_asgi()),
    path('ws/matchmaking/', consumers.match_maker.as_asgi()),
]