from rest_framework.authtoken.models import Token
from django.conf import settings
from channels.db import database_sync_to_async
from .exceptions import ClientError
from groups.models import *


@database_sync_to_async
def save_client_with_hash(the_user , the_group ,the_hash):
	#save clients which their videos accepted
	try:
		group_obj = Group.objects.get(groupid=the_group)
		obj = AcceptedClient(entered_group=group_obj , accepted_client=the_user , recieved_hash=the_hash)
		obj.save()
	except Group.DoesNotExist:
		raise ClientError("ROOM_INVALID")

@database_sync_to_async
def save_hash(the_group , the_hash):
	# Save the hash to the hash field of a Group instance
	try:  
			obj = Group.objects.get(groupid=the_group)
			obj.video_hash = the_hash
			obj.save()
			return obj.video_hash
	except Group.DoesNotExist:
		raise ClientError("ROOM_INVALID")

@database_sync_to_async
def get_room(roomid):

	# Find the room they requested (by ID)
	try:
		return Group.objects.get(groupid=roomid)
	except Group.DoesNotExist:
		raise ClientError("ROOM_INVALID")

@database_sync_to_async
def is_member(user,roomid):

	# Check a user is a member of group
	try:
		return Membership.objects.filter(
			the_member=user,
			the_group=roomid
		).exists()

	except Membership.DoesNotExist:
		pass

@database_sync_to_async
def is_creator(user,roomid):
	try:
		return Group.objects.filter(
			groupid=roomid,
			created_by=user
			).exists()
	except Group.DoesNotExist:
		pass

@database_sync_to_async	
def set_status(roomid,state):
	obj = Group.objects.get(groupid=roomid)
	obj.status = state
	obj.save()
	return obj.status