from channels.db import database_sync_to_async
from .exceptions import ClientError
from .models import *
from rest_framework.authtoken.models import Token
from django.conf import settings

@database_sync_to_async
def get_room_or_error(roomid):

	# Find the room they requested (by ID)
	try:
		room = Group.objects.get(groupid=roomid)
	except Group.DoesNotExist:
		raise ClientError("ROOM_INVALID")

@database_sync_to_async
def join_error(user):
	raise ClientError("USER_IS_NOW_A_MEMBER")

