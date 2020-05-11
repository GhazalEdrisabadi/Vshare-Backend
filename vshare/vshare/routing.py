from django.conf.urls import url
from channels.http import AsgiHandler
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from stream.middlewares import TokenAuthMiddlewareStack

from stream.consumers import VideoConsumer , TextChat

from groups.models import *

application = ProtocolTypeRouter({
	"websocket":TokenAuthMiddlewareStack(
		URLRouter(
			[
				url(r'^stream/groups/(?P<groupid>[\w.@+-]+)/$', VideoConsumer),
				url(r'^chat/groups/(?P<groupid>[\w.@+-]+)/$', TextChat),
			]
		)
	)
})

"""
Request to VideoConsumer
"ws://127.0.0.1:8000/stream/groups/<groupid>/?token=token_id
{"command":"send_client_hash","roomid":"starwars", "vhash":"fffffffffff"}
"""