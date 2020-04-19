from django.conf.urls import url
from channels.http import AsgiHandler
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from stream.middlewares import TokenAuthMiddlewareStack
from stream.consumers import VideoConsumer

application = ProtocolTypeRouter({
	"websocket":TokenAuthMiddlewareStack(
		URLRouter(
			[
				url(r'^stream/groups/(?P<groupid>[\w.@+-]+/$', VideoConsumer),
			]
		)
	)
})

"""

Request to VideoConsumer

"ws://127.0.0.1:8000/stream/groups/<groupid>/?token=token_id

"""