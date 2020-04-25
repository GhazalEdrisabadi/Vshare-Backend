from rest_framework.authtoken.models import Token
from django.conf import settings
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.contrib.auth.models import AnonymousUser
from .exceptions import ClientError
from channels.exceptions import DenyConnection
from stream.utils import *
import asyncio
import json

class VideoConsumer(AsyncJsonWebsocketConsumer):

	# Connect websocket
	async def connect(self):

		user = self.scope["user"]
		roomid = self.scope['url_route']['kwargs']['groupid']
		self.roomid = roomid
		# Check room is valid or not
		room = await get_room(roomid)
		ismember = await is_member(user,roomid)

		# Get current state and hash
		status = await get_status(roomid)
		vhash = await get_hash(roomid)

		# Check user logged in or is in the group
		if user.is_anonymous or not ismember:
			# Reject connection
			await self.close()

		# Check state (in state=2 client can't connect)
		elif status == 2:
			# Reject connection
			await self.close()

		else:
			# Add clients to stream group and accept connection
			await self.channel_layer.group_add(roomid,self.channel_name)
			await self.accept()

			# Send welcome message to user
			await self.send_json(
				{
					"room":roomid,
					"username":user.username,
					"status":status,
					"hash":vhash,
					"message":"you connect successfully.",
				}
			)

	# Recieve websocket requests
	async def receive_json(self, content):

		command = content.get("command",None)

		try:
			if command == "set_video_hash":
				await self.recieve_stream(content["vhash"])

			elif command == "send_client_hash":
				await self.check_client_hash(content["vhash"])

			elif command == "play_video":
				await self.play()

		except ClientError as e:
			await self.send_json({"error": e.code})

	async def recieve_stream(self,vhash):	

		user = self.scope["user"]
		iscreator = await is_creator(user,self.roomid)
		ismember = await is_member(user,self.roomid)
		status = await get_status(self.roomid)

		# In state 1 only owner can send video
		if status == 0 and iscreator:

	    	# Save hash to database
			videohash = await save_hash(self.roomid,vhash)

			# Change state to 1
			groupstatus = await set_status(self.roomid,state=1)
			
			# Notify to clients that state is 1 and send hash to them
			await self.channel_layer.group_send(
					self.roomid,
					{
						"type":"send_hash",
						"status":groupstatus,
						"hash":videohash,
						"message":"video sent by owner.",
					}
				)
		else:
			await self.send_json(
					{
						"username":user.username,
						"status":status,
						"message":"you can't send video!",
					}
				)



	async def check_client_hash(self,vhash):

		user = self.scope["user"]
		iscreator = await is_creator(user,self.roomid)
		ismember = await is_member(user,self.roomid)
		status = await get_status(self.roomid)

		if status == 1 and ismember and not iscreator:

			ownerhash = await get_owner_hash(self.roomid)
			
			# Check client hash with owner hash
			if ownerhash == vhash:

				await self.send_json(
					{
						"username":user.username,
						"status":status,
						"message":"you add to stream successfully.",
					}
				)
			elif clienthash is not None:
				await self.send_json(
					{
						"username":user.username,
						"message":"your hash was sent once.",
					}
				)

			else:
				await self.send_json(
					{
						"username":user.username,
						"message":"your hash is not match. you should send it again!",
					}
				)
		else:
			await self.send_json(
					{
						"username":user.username,
						"status":status,
						"message":"you can't send video in this state!",
					}
				)

	# When video is played change state and notify clients
	async def play(self):

		user = self.scope["user"]
		iscreator = await is_creator(user,self.roomid)
		ismember = await is_member(user,self.roomid)
		status = await get_status(self.roomid)

		if status == 1 and iscreator:
		# Change state to 2
			groupstatus = await set_status(self.roomid,state=2)

			await self.channel_layer.group_send(
						self.roomid,
						{
							"type":"send_state",
							"status":groupstatus,
							"message":"video played by owner",
						}
					)

		elif status == 1 and ismember:
			await self.send_json(
				{
					"username":user.username,
					"status":status,
					"message":"you can't play video before owner!",
				}
			)

		elif status == 0 and iscreator:
			await self.send_json(
				{
					"username":user.username,
					"status":status,
					"message":"you should select video first!",
				}
			)

		elif status == 0 and ismember:
			await self.send_json(
				{
					"username":user.username,
					"status":status,
					"message":"video was not selected by owner!",
				}
			)
		else:
			await self.send_json(
				{
					"username":user.username,
					"status":status,
					"message":"video is playing now!",
				}
			)

	""" 
	 Handlers for messages sent over the channel layer
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
	
