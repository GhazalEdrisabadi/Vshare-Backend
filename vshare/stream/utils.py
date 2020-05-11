from rest_framework.authtoken.models import Token
from django.conf import settings
from channels.db import database_sync_to_async
from .exceptions import ClientError
from groups.models import *

#remove the disconected user from the online users
@database_sync_to_async
def remove_online_user(the_user,the_room):
	try:
		obj = Group.objects.get(groupid=the_room)
		instance = OnlineUser.objects.get(online_user=the_user, joined_group=obj)
		instance.delete()
		return instance
	except Group.DoesNotExist:
		raise ClientError("ROOM_INVALID")

#add the connected user to online users
@database_sync_to_async
def add_online_user(the_user,the_room):
	try:
		obj = Group.objects.get(groupid=the_room)	
		new_obj=OnlineUser(online_user=the_user, joined_group=obj)
		new_obj.save()
		return new_obj

	except Group.DoesNotExist:
		raise ClientError("ROOM_INVALID")

#store the recieved message to the database
@database_sync_to_async
def store_message(user,message_client,the_room):
	try:
		obj = Group.objects.get(groupid=the_room)	
		new_obj=Message(message_text=message_client, target_group=obj, message_sender=user)
		new_obj.save()
		return new_obj
	except Group.DoesNotExist:
		raise ClientError("ROOM_INVALID")

# Check a user is a member of group
@database_sync_to_async
def is_member(user,roomid):
	try:
		return Membership.objects.filter(
			the_member=user,
			the_group=roomid
		).exists()
	except Membership.DoesNotExist:
		raise ClientError("ROOM_INVALID")

# Check a user is a creator of group
@database_sync_to_async
def is_creator(user,roomid):
	try:
		return Group.objects.filter(
			groupid=roomid,
			created_by=user
			).exists()
	except Group.DoesNotExist:
		raise ClientError("ROOM_INVALID")

# Find room by requested id
@database_sync_to_async
def get_room(roomid):
	try:
		return Group.objects.get(groupid=roomid)
	except Group.DoesNotExist:
		raise ClientError("ROOM_INVALID")

# Set status for group
@database_sync_to_async	
def set_status(roomid,state):
	try:
		obj = Group.objects.get(groupid=roomid)
		obj.status = state
		obj.save()
		return obj.status
	except Group.DoesNotExist:
		raise ClientError("ROOM_INVALID")

# Get status by requested id
@database_sync_to_async	
def get_status(roomid):
	try:
		return Group.objects.get(groupid=roomid).status
	except Group.DoesNotExist:
		raise ClientError("ROOM_INVALID")

# Save the hash to the hash field of a group instance
@database_sync_to_async
def set_group_hash(the_group,the_hash):
	try:  
			obj = Group.objects.get(groupid=the_group)
			obj.video_hash = the_hash
			obj.save()
			return obj.video_hash
	except Group.DoesNotExist:
		raise ClientError("ROOM_INVALID")

# Get group hash by requested id
@database_sync_to_async	
def get_group_hash(roomid):
	try:
		return Group.objects.get(groupid=roomid).video_hash
	except Group.DoesNotExist:
		raise ClientError("ROOM_INVALID")

# Save clients which their videos accepted
@database_sync_to_async
def save_client_with_hash(the_user,the_group,the_hash):
	try:
		group_obj = Group.objects.get(groupid=the_group)
		obj = AcceptedClient(
			entered_group=group_obj , 
			accepted_client=the_user , 
			recieved_hash=the_hash
		)
		obj.save()
		return obj
	except Group.DoesNotExist:
		raise ClientError("ROOM_INVALID")

# Get client hash by requested group and client id
@database_sync_to_async
def get_client_hash(the_user, the_group):
	try:
		group_obj = Group.objects.get(groupid=the_group)
		try:
			obj = AcceptedClient.objects.get(
				entered_group=group_obj,
				accepted_client=the_user
			)
			return obj.recieved_hash
		except AcceptedClient.DoesNotExist:
			raise ClientError("Client_INVALID")
	except Group.DoesNotExist:
		raise ClientError("ROOM_INVALID")