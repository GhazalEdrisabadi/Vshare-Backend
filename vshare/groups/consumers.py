from django.conf import settings
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from .exceptions import ClientError
from .utils import get_room_or_error
from .models import *
from django.apps import apps

class VideoConsumer(AsyncJsonWebsocketConsumer):

	UserModel = apps.get_model('users', 'Account')
	# room_id = Group.objects.get(groupid=groupid)

	# Help for me
	# A channel is a mailbox where messages can be sent to. 
	# Each channel has a name. Anyone who has the name of a 
	# channel can send a message to the channel.
	# A group is a group of related channels. A group has 
	# a name. Anyone who has the name of a group can add/remove 
	# a channel to the group by name and send a message
	# to all channels in the group.

	async def connect (self):

		# Check user is group's member or loggid in
		if self.scope["user"].is_anonymous or not is_member:
			# Reject connection
			await self.close()
		else:
			# Accept connection
			await self.accept()
		self.rooms = set()

	async def receive (self, data):

		command = data.get("command", None)

		try:
			if command == "join stream":
				# Join to stream
				await self.join_stream(data["room"])
		except ClientError as e:
			await self.send_json({"error": e.code})

	async def disconnect(self, message):
		
		for room_id in list(self.rooms):
			try:
				# Leave the stream
				await self.leave_stream(room_id)
			except ClientError:
				pass

	async def join_stream(self, event):
		# Send a message down to the client
		await self.send_json(
	    	{
	        	"msg_type": settings.MSG_TYPE_ENTER,
	        	"room": event["room_id"],
	        	"username": event["username"],
	    	},
		)

	async def leave_stream(self, event):
		# Send a message down to the client
		await self.send_json(
	    	{
	        	"msg_type": settings.MSG_TYPE_LEAVE,
	        	"room": event["room_id"],
	        	"username": event["username"],
	    	},
		)

	async def join_room(self, room_id):
		
		room = await get_room_or_error(room_id, self.scope["user"])

		# Send a join message if it's turned on
		if settings.NOTIFY_USERS_ON_ENTER_OR_LEAVE_ROOMS:
			await self.channel_layer.group_send(
				room.group_name,
				{
					"type": "join.stream",
					"room_id": room_id,
					"username": self.scope["user"].username,
				}
			)
        # Store that we're in the room
		self.rooms.add(room_id)

		# Add them to the group so they get room messages
		await self.channel_layer.group_add(
			room.group_name,
			self.channel_name,
		)

		# Instruct their client to finish opening the room
		await self.send_json({
			"join": str(room.id),
			"title": room.groupid,
		})

	async def leave_room(self, room_id):
		
		room = await get_room_or_error(room_id, self.scope["user"])

		# Send a leave message if it's turned on
		if settings.NOTIFY_USERS_ON_ENTER_OR_LEAVE_ROOMS:
			await self.channel_layer.group_send(
			    room.group_name,
			    {
			        "type": "leave.stream",
			        "room_id": room_id,
			        "username": self.scope["user"].username,
			    }
			)

		# Remove that we're in the room
		self.rooms.discard(room_id)

		# Remove them from the group so they no longer get room messages
		await self.channel_layer.group_discard(
		    room.group_name,
		    self.channel_name,
		)

		# Instruct their client to finish closing the room
		await self.send_json({
		    "leave": str(room.id),
		})