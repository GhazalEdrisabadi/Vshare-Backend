from django.urls import path

from channels.http import AsgiHandler
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

from groups.consumers import VideoConsumer


application = ProtocolTypeRouter({
	"websocket": AuthMiddlewareStack(
		URLRouter([
			path("group/stream/", VideoConsumer),  
		]),
	),
})