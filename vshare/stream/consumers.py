from rest_framework.authtoken.models import Token
from django.conf import settings
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.contrib.auth.models import AnonymousUser
from .exceptions import ClientError
from channels.exceptions import DenyConnection
from stream.utils import *
import asyncio
import json


# Help
# A channel is a mailbox where messages can be sent to. 
# Each channel has a name. Anyone who has the name of a 
# channel can send a message to the channel.
# A group is a group of related channels. A group has 
# a name. Anyone who has the name of a group can add/remove 
# a channel to the group by name and send a message
# to all channels in the group.

class VideoConsumer(AsyncJsonWebsocketConsumer):

	async def connect(self):

		user = self.scope["user"]
		roomid = self.scope['url_route']['kwargs']['groupid']
		room = await get_room(roomid)
		ismember = await is_member(user,roomid)

		# Check user logged in or is in the group
		if user.is_anonymous or not ismember:
			# Reject connection
			await self.close()
		else:
			# Add members to stream group and accept connection
			await self.channel_layer.group_add(roomid,self.channel_name)
			await self.accept()
			await self.channel_layer.group_send(room.group_id,{"status":room.status})

			# Send welcome message to user
			await self.send_json(
				{
					"room":room.groupid,
					"username":user.username,
					"message":"you successfully connected.",
				}
			)
			await asyncio.sleep(60)

			# Send current state to all clients
			await self.channel_layer.group_send(
				room.groupid,
				{
					"state":room.group_status
				}
			)

	async def receive_json(self, content):

		user = self.scope["user"]
		iscreator = await is_creator(user,roomid)
		room = await get_room(roomid)

		command = content.get("command",None)

		try:
			if command == "send stream":
				if room.status == state0 and iscreator:
					await self.recieve_stream(content["room"],content["hash"])
				else:
					await self.send_json(
						{
							"room":room.roomid,
							"username":user.username,
							"message": "you can't send video!"
						}
					)

		except ClientError as e:
			await self.send_json({"error": e.code})

	# State0:
	# 	Send hash by owner to backend, 
	#  	Save hash to database,
	# 	Change state to 1 and notify to clients
	async def recieve_stream(self,roomid,hash):

		room = await get_room(roomid)
		save_hash(room,hash)
		# Change state to 1
		await set_status(roomid,state1)
		
		# Notify to clients that state of group is 1
		await self.channel_layer.group_send(
			room.group_id,
			{
				"status":room.status
			}
		)
