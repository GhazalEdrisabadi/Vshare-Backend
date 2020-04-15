from django.conf.urls import url
from channels.http import AsgiHandler
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack


from groups.middlewares import TokenAuthMiddleware
from groups.consumers import VideoConsumer

application = ProtocolTypeRouter({
	"websocket":TokenAuthMiddleware(
		URLRouter(
			[
				# url(r'^stream/groups/(?P<groupid>[\w.@+-]+/$', VideoConsumer),
				url(r'^stream/groups', VideoConsumer),
			]
		)
	)
})

# ws://ourdomain/<groupid>/?token=token