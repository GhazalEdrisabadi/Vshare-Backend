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
		self.roomid = roomid
		ismember = await is_member(user,roomid)

		# Check user logged in or is in the group
		if user.is_anonymous or not ismember:
			# Reject connection
			await self.close()

		# Check state (in state=2 client can't connect)
		elif room.status == 2:
			# Reject connection
			await self.close()

		else:
			# get current state and hash
			status = await get_status(roomid)
			vhash = await get_hash(roomid)

			# Add clients to stream group and accept connection
			await self.channel_layer.group_add(self.roomid,self.channel_name)
			await self.accept()

			# Send welcome message to user
			await self.send_json(
				{
					"room":roomid,
					"username":user.username,
					"status":status,
					"hash":vhash,
					"message":"you successfully connected.",
				}
			)

	# Recieve websockets requests
	async def receive_json(self, content):

		user = self.scope["user"]
		room = await get_room(self.roomid)
		iscreator = await is_creator(user,self.roomid)

		command = content.get("command",None)

		try:
			if command == "set_video_hash":
					await self.recieve_stream(content["roomid"],content["vhash"])

			elif command == "send_cient_hash":
				await self.send_hash()

			elif command == "play_video":
				await self.play(content["roomid"])

		except ClientError as e:
			await self.send_json({"error": e.code})

	# State0:
	# 	Send hash by owner to backend, 
	#  	Save hash to database,
	# 	Change state to 1 and notify to clients
	async def recieve_stream(self,roomid,vhash):	

		user = self.scope["user"]
		room = await get_room(roomid)
		iscreator = await is_creator(user,roomid)

		# In state 1 only owner can send video
		if room.status == 0 and iscreator:

	    	# Save hash to database
			videohash = await save_hash(room.groupid,vhash)

			# Change state to 1
			groupstatus = await set_status(room.groupid,state=1)
			
			# Notify to clients that state is 1 and send hash to them
			await self.channel_layer.group_send(
					self.room_id,
					{
						"type":"send_hash",
						"status":groupstatus,
						"hash":videohash,
						"message":"video sent by owner"
					}
				)
		else:
			await self.send_json(
						{
							"room":room.groupid,
							"username":user.username,
							"message": "you can't send video!"
						}
					)

	# Amin manzooram ine:
	async def send_hash(self):

		if room.status == 1 and not iscreator:
					await self.send_json(
						{
							"message": "your video accepted."
						}
					)	
					await self.save_client_with_hash(user,roomid,content["vhash"])
				else:
					await self.send_json(
						{
							"message": "you can't choose a video for now!"
						}
					)


	# When video is played change state and notify clients
	async def play(self, roomid):

		room = await get_room(roomid)

		if room.status == 1:
		# Change state to 2
			groupstatus = await set_status(room.groupid,state=2)

			await self.channel_layer.group_send(
						self.room_id,
						{
							"type":"send_state",
							"status":groupstatus,
							"message":"video played by owner",
						}
					)

	""" 
	Handlers for group sends
	"""
	# Called when we want send state to clients
	async def send_state(self, event):
		await self.send_json(
			{
				"msg_type":"state of group",
				"status":event["status"],
				"message":event["message"],
			}
		)

	# Called when we want send hash to clients
	async def send_hash(self, event):
		await self.send_json(
			{
				"msg_type":"send hash",
				"status":event["status"],
				"hash":event["hash"],
				"message":event["message"],
			}
		)