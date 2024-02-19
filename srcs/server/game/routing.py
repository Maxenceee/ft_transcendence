from django.urls import re_path, path

from . import consumers

websocket_urlpatterns = [
    path('socket', consumers.websocket_client.as_asgi())
]