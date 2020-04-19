import asyncio
import json
from django.conf import settings
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import AnonymousUser
from .exceptions import ClientError
from channels.exceptions import DenyConnection
from channels.consumer import AsyncConsumer
from .models import *
import logging



class VideoConsumer(AsyncJsonWebsocketConsumer):

	# Help
	# A channel is a mailbox where messages can be sent to. 
	# Each channel has a name. Anyone who has the name of a 
	# channel can send a message to the channel.
	# A group is a group of related channels. A group has 
	# a name. Anyone who has the name of a group can add/remove 
	# a channel to the group by name and send a message
	# to all channels in the group.

	async def connect (self):
		# roomid = self.scope['url_rote']['kwargs']['groupid']
		# room = get_room_or_error(roomid)
		user = self.scope["user"]
		await self.accept()
		print(user.username)
		print(11111111111)


	# async def receive_json(self, content):


	async def receive (self, text_data=None):
		# Called with either text_data or bytes_data for each frame
		# You can call:
		await self.send(text_data="Hello world!")
		# Or, to send a binary frame:
		await self.send(bytes_data="Hello world!")
		# Want to force-close the connection? Call:
		await self.close()
		# Or add a custom WebSocket error code!
		await self.close(code=4123)


		command = data.get("command", None)
		try:
			if command == "join room":
				# Join to room
				await self.join_room(data["room"])
			elif command == "leave room":
				await self.leave_room(data["room"])
		except ClientError as e:
			await self.send_json({"error": e.code})

	async def disconnect(self, close_code):
		for room_id in list(self.rooms):
			try:
				await self.leave_room(room_id)
			except ClientError:
				pass

	async def join_room(self, room_id):
	
		user = self.scope["user"]
		room = await get_room_or_error(room_id, user)

		if not user.is_member and not user.is_creator:
			await self.channel_layer.group_send(
				room.group_name,
				{
					"type": "join.stream",
					"room_id": room_id,
					"username": user.username,
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
				"title": room.title,
			})
		
		else:
			await join_error(user)


	async def leave_room(self, room_id):
		
		user = self.scope["user"]
		room = await get_room_or_error(room_id, user)
		
		# Send a leave message if it's turned on
		if settings.NOTIFY_USERS_ON_ENTER_OR_LEAVE_ROOMS:
			await self.channel_layer.group_send(
				room.group_name,
				{
					"type": "leave.stream",
					"room_id": room_id,
					"username": user.username,
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