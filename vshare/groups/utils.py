from channels.db import database_sync_to_async
from .exceptions import ClientError
from .models import *
from django.contrib.auth.models import AnonymousUser
from rest_framework.authtoken.models import Token
from channels.auth import AuthMiddlewareStack
from django.apps import apps
from django.utils.translation import gettext_lazy as _
import rest_framework.authtoken.models
import rest_framework.exceptions

@database_sync_to_async
def get_room_or_error(room_id, user):

	if not user.is_authenticated:
		raise ClientError("USER_HAS_TO_LOGIN")

	# Find the room they requested (by ID)
	try:
		room = Group.objects.get(groupid=room_id)
	except Group.DoesNotExist:
		raise ClientError("ROOM_INVALID")

	return room

@database_sync_to_async
def join_error(user):
	raise ClientError("USER_IS_NOW_A_MEMBER")


@database_sync_to_async
def get_user(headers):
	try:
		token_name, token_key = headers[b'authorization'].decode().split()
		print(headers[b'authorization'])
		if token_name == 'Token':
			token = Token.objects.get(key=token_key)
			return token.user
	except Token.DoesNotExist:
		return AnonymousUser()

"""

This Middleware, will check keys provided in HTTP header.
If authorization is sent, will try to fetch it’s value. 
If the token name is Token then will try to find the 
corresponded Token Object for this in database. 
If so will fetch the user for that and update 
scope['user'] with that value.

"""
class TokenAuthMiddleware:

	def __init__(self, inner):
		self.inner = inner

	def __call__(self, scope):
		return TokenAuthMiddlewareInstance(scope, self)

class TokenAuthMiddlewareInstance:

	def __init__(self, scope, middleware):
		self.middleware = middleware
		self.scope = dict(scope)
		self.inner = self.middleware.inner

	async def __call__(self, receive, send):
		headers = dict(self.scope['headers'])
		print(headers)
		if b'authorization' in headers:
			self.scope['user'] = await get_user(headers)
			print(self.scope['user'])
		inner = self.inner(self.scope)
		return await inner(receive, send)

TokenAuthMiddlewareStack = lambda inner: TokenAuthMiddleware(AuthMiddlewareStack(inner))

# class TokenAuthMiddleware:

# 	def __init__(self, inner):
# 		"""Save given inner middleware to invoke in the `__call__`."""
# 		self._inner = inner

# 	def __call__(self, scope):
# 		"""Add user to the scope by 'Authorization: Token...' header."""

# 		# This function carefully and creatively copied from Django REST
# 		# framework implementation `TokenAuthentication` class.

# 		# Only handle "Authorization" headers starting with "Token".
# 		headers = dict(scope["headers"])
# 		if b"authorization" not in headers:
# 			return self._inner(scope)
# 		auth_header = headers[b"authorization"].split()
# 		if not auth_header or auth_header[0].lower() != "token".encode():
# 			return self._inner(scope)

# 		# Check header correctness. Since we use Django REST framework
# 		# for token-based authentication, we raise its exceptions.
# 		AuthError = rest_framework.exceptions.AuthenticationFailed
# 		if len(auth_header) == 1:
# 			raise AuthError(_("Invalid token header: no credentials provided!"))
# 		if len(auth_header) > 2:
# 			raise AuthError(_("Invalid token header: token string contains spaces!"))
# 		try:
# 			auth_header_token = auth_header[1].decode()
# 		except UnicodeError:
# 			raise AuthError(_("Invalid token header: token contains invalid symbols!"))

# 		# According to the warning in the Channels authentication docs
# 		# we have to manually close old database connections to prevent
# 		# usage of timed out connections.
# 		django.db.close_old_connections()

# 		# Find a user by the token.
# 		Token = rest_framework.authtoken.models.Token
# 		try:
# 			token = Token.objects.select_related("user").get(key=auth_header_token)
# 		except Token.DoesNotExist:
# 			raise AuthError(_("Invalid token!"))
# 		if not token.user.is_active:
# 			raise AuthError(_("User is inactive!"))

# 		# Call inner middleware with a user in the scope.
# 		return self._inner(dict(scope, user=token.user))
		
# TokenAuthMiddlewareStack = lambda inner: TokenAuthMiddleware(AuthMiddlewareStack(inner))