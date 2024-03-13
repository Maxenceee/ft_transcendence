import os
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
import game_classic.routing
import game_local.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'back.settings')

asgi_application = get_asgi_application()

application = ProtocolTypeRouter({
	"http": asgi_application,
	"websocket": URLRouter(game_classic.routing.websocket_urlpatterns + game_local.routing.websocket_urlpatterns)
})