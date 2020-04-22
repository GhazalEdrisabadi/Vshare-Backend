from rest_framework.authtoken.models import Token
from django.conf import settings
from channels.db import database_sync_to_async
from urllib.parse import parse_qs
from channels.auth import AuthMiddlewareStack
from django.contrib.auth.models import AnonymousUser
import asyncio

@database_sync_to_async
def get_user(token):
	try:
		return Token.objects.get(key=token).user
	except Token.DoesNotExist:
		return AnonymousUser()

class TokenAuthMiddlewareInstance:

	def __init__(self, scope, middleware):
		self.middleware = middleware
		self.scope = dict(scope)
		self.inner = self.middleware.inner

	async def __call__(self, receive, send):
		token = parse_qs(self.scope["query_string"].decode("utf8"))["token"][0]
		self.scope['user'] = await get_user(token)
		inner = self.inner(self.scope)
		return await inner(receive, send)

class TokenAuthMiddleware:
	def __init__(self, inner):
		self.inner = inner

	def __call__(self, scope):
		return TokenAuthMiddlewareInstance(scope, self)


TokenAuthMiddlewareStack = lambda inner: TokenAuthMiddleware(AuthMiddlewareStack(inner))

		
	