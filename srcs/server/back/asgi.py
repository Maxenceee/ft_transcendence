import os
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
import index.routing
import game.routing

import game_2player.routing
import game_4player.routing
import game_local.routing
import game_AI.routing
import tournament.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'back.settings')

asgi_application = get_asgi_application()

application = ProtocolTypeRouter({
	"http": asgi_application,
	"websocket": URLRouter(index.routing.websocket_urlpatterns + game.routing.websocket_urlpatterns + game_2player.routing.websocket_urlpatterns + game_local.routing.websocket_urlpatterns + game_4player.routing.websocket_urlpatterns + tournament.routing.websocket_urlpatterns + game_AI.routing.websocket_urlpatterns)
})