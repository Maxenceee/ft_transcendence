import os
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
import index.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'back.settings')

asgi_application = get_asgi_application()

application = ProtocolTypeRouter({
	"http": asgi_application,
	"websocket": URLRouter(index.routing.websocket_urlpatterns)
})