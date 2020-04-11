from django.urls import path
from django.conf.urls import url

from channels.http import AsgiHandler
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

from groups.consumers import VideoConsumer


application = ProtocolTypeRouter({
	"websocket": AuthMiddlewareStack(
		URLRouter([
			url(r'^groups/stream/(?P<token>[\w.@+-]+)/$', VideoConsumer),
			# url(r"messages/(?P<username>[\w.@+-]+)/$", ChatConsumer, name='chat')
		]),
	),
})