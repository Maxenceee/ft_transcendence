import os
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

import index.routing
import game.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'back.settings')

asgi_application = get_asgi_application()

application = ProtocolTypeRouter({
	"http": asgi_application,
	"websocket": URLRouter(game.routing.websocket_urlpatterns + index.routing.websocket_urlpatterns)
})