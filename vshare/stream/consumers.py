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
		grouphash = await get_group_hash(roomid)

		# Check user logged in or is in the group
		if user.is_anonymous or not ismember:
			# Reject connection
			await self.close()

		elif status == 0 or status == 1:

			# Add clients to stream group and accept connection
			await self.channel_layer.group_add("stream",self.channel_name)
			await self.accept()

			# Send welcome message to user
			await self.send_json(
				{
					"room":roomid,
					"username":user.username,
					"status":status,
					"hash":grouphash,
					"message":"you connect successfully.",
				}
			)
		else:
			await self.channel_layer.group_add("stream",self.channel_name)
			await self.accept()

			await self.channel_layer.group_send(
				"stream",
				{
					"type":"send_info",
					"room":roomid,
					"username":user.username,
					"status":status,
					"hash":grouphash,
					"message":"new user connect successfully.",
				}
			)


	# Recieve websocket requests
	async def receive_json(self, content):

		command = content.get("command",None)

		try:
			if command == "set_video_hash":
				await self.receive_stream(content["vhash"])

			elif command == "send_client_hash":
				await self.check_client_hash(content["vhash"])

			elif command == "send_current_time":
				await self.get_current_time(content["currentTime"])

			elif command == "play_video":
				await self.play(content["currentTime"])

			elif command == "pause_video":
				await self.pause(content["currentTime"])

			elif command == "reset":
				await self.reset_state()

			elif command == "user_permission":
				await self.get_permission(content["user"],content["per1"],content["per2"])

		except ClientError as e:
			await self.send_json({"error": e.code})


	async def receive_stream(self,vhash):	

		user = self.scope["user"]
		roomid = self.scope['url_route']['kwargs']['groupid']
		iscreator = await is_creator(user,roomid)
		haspermission = await select_permission(user,roomid)
		ismember = await is_member(user,roomid)
		status = await get_status(roomid)

		# In state 1 only admin and users that have permission, can send video
		if iscreator or haspermission:
			hashsender = await set_sender(user,roomid)
			if status == 0:

		    	# Save hash to database
				videohash = await set_group_hash(roomid,vhash)

				# Change state to 1
				groupstatus = await set_status(roomid,state=1)
				
				# Notify to clients that state is 1 and send hash to them
				await self.channel_layer.group_send(
					"stream",
					{
						"type":"send_hash",
						"status":groupstatus,
						"hash":videohash,
						"message":"video sent by admin or selector.",
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
		else:
			await self.send_json(
				{
					"username":user.username,
					"message":"Permission denied!",
				}
			)

	async def check_client_hash(self,vhash):

		user = self.scope["user"]
		roomid = self.scope['url_route']['kwargs']['groupid']
		issender = await is_sender(user,roomid)
		ismember = await is_member(user,roomid)
		status = await get_status(roomid)

		if ismember and not issender:
			if status == 1:

				grouphash = await get_group_hash(roomid)
				
				# Check client hash with owner hash
				if grouphash == vhash:

					await self.send_json(
						{
							"username":user.username,
							"status":status,
							"message":"you add to stream successfully.",
						}
					)

				else:
					await self.send_json(
						{
							"username":user.username,
							"message":"your hash is not match. you should send it again!",
						}
					)

			elif status == 2:

				grouphash = await get_group_hash(roomid)
				
				# Check client hash with owner hash
				if grouphash == vhash:

					await self.channel_layer.group_send(
						"stream",
						{
							"type":"send_state",
							"status":status,
							"message":"new user's hash is ok.",
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
		else:
			await self.send_json(
				{
					"username":user.username,
					"message":"Permission denied!",
				}
			)

	async def get_current_time(self,currentTime):
		user = self.scope["user"]
		roomid = self.scope['url_route']['kwargs']['groupid']
		iscreator = await is_creator(user,roomid)
		haspermission = await playback_permission(user,roomid)
		status = await get_status(roomid)

		if iscreator or haspermission:
			if status == 2:

				await self.channel_layer.group_send(
					"stream",
					{
						"type":"send_time",
						"status":status,
						"currentTime":currentTime,
						"message":"this is current time for new users",
					}
				)
			else:
				await self.send_json(
					{
						"username":user.username,
						"status":status,
						"message":"you can't send time in this state!",
					}
				)
		else:
			await self.send_json(
				{
					"username":user.username,
					"message":"Permission denied!",
				}
			)


	# When video played change state and notify clients
	async def play(self,currentTime):

		user = self.scope["user"]
		roomid = self.scope['url_route']['kwargs']['groupid']
		iscreator = await is_creator(user,roomid)
		haspermission = await playback_permission(user,roomid)
		status = await get_status(roomid)

		if iscreator or haspermission:
			if status == 1:
				# Change state to 2
				groupstatus = await set_status(roomid,state=2)

				await self.channel_layer.group_send(
					"stream",
					{
						"type":"send_time",
						"status":groupstatus,
						"currentTime":currentTime,
						"message":"video played by admin or controller",
					}
				)

			elif status == 2:
				await self.channel_layer.group_send(
					"stream",
					{
						"type":"send_time",
						"status":status,
						"currentTime":currentTime,
						"message":"video played by admin or controller again",
					}
				)

			else:
				await self.send_json(
				{
					"username":user.username,
					"status":status,
					"message":"you should select video first!",
				}
			)

		else:
			await self.send_json(
				{
					"username":user.username,
					"message":"Permission denied!",
				}
			)

	# When video paused notify clients
	async def pause(self,currentTime):
		user = self.scope["user"]
		roomid = self.scope['url_route']['kwargs']['groupid']
		iscreator = await is_creator(user,roomid)
		haspermission = await playback_permission(user,roomid)
		status = await get_status(roomid)

		if iscreator or haspermission:
			if status == 1:
				await self.send_json(
					{
						"username":user.username,
						"status":status,
						"message":"video is hashing now.Please wait!",
					}
				)

			elif status == 2:
				await self.channel_layer.group_send(
					"stream",
					{
						"type":"send_time",
						"status":status,
						"currentTime":currentTime,
						"message":"video paused by admin or controller",
					}
				)

			else:
				await self.send_json(
					{
						"username":user.username,
						"status":status,
						"message":"you should select video first!",
					}
				)

		else:
			await self.send_json(
				{
					"username":user.username,
					"message":"Permission denied!"
				}
			)

	async def reset_state(self):
		user = self.scope["user"]
		roomid = self.scope['url_route']['kwargs']['groupid']
		iscreator = await is_creator(user,roomid)
		haspermission = await select_permission(user,roomid)
		status = await get_status(roomid)

		if iscreator or haspermission:
			if status == 1 or status == 2:
				groupstatus = await set_status(roomid,state=0)
				await self.channel_layer.group_send(
					"stream",
					{
						"type":"send_state",
						"status":groupstatus,
						"message":"group was reset!",
					}
				)
			else:

				await self.send_json(
					{
						"username":user.username,
						"status":status,
						"message":"Nothing to reset in this state!",
					}
				)
		else:

			await self.send_json(
				{
					"username":user.username,
					"message":"Permission denied!",
				}
			)

	async def get_permission(self,user,per1,per2):

		await self.channel_layer.group_send(
					"stream",
					{
						"type":"send_permission",
						"username":user,
						"permission1": per1,
						"permission2": per2,
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

	async def send_time(self, event):
		await self.send_json(
			{
				"msg_type":"send time",
				"status":event["status"],
				"time":event["currentTime"],
				"message":event["message"],
			}
		)

	async def send_info(self, event):
		await self.send_json(
			{
				"msg_type":"send info",
				"room":event["room"],
				"username":event["username"],
				"status":event["status"],
				"hash":event["hash"],
				"message":event["message"],
			}
		)

	async def send_permission(self, event):
		await self.send_json(
			{
				"msg_type":"send permission",
				"username":event["username"],
				"permission1":event["permission1"],
				"permission2":event["permission2"],
			}
		)






#created to implement chat feature
class TextChat(AsyncJsonWebsocketConsumer):

	# Connect websocket
	async def connect(self):

		user = self.scope["user"]
		roomid = self.scope['url_route']['kwargs']['groupid']
		self.roomid = roomid
		# Check room is valid or not
		room = await get_room(roomid)
		ismember = await is_member(user,roomid)

		# Check user logged in or is in the group
		if user.is_anonymous or not ismember:
			# Reject connection
			await self.close()
		else:
			# Add clients to chat and accept connection
			await self.channel_layer.group_add(roomid,self.channel_name)
			await self.accept()
			onlineduser = await add_online_user(user,roomid)


			# Send welcome message to user
			await self.send_json(
				{
					"room":roomid,
					"username":user.username,
					"message":"you connected to chat successfully.",
				}
			)


			await self.channel_layer.group_send(
				self.roomid,
				{
					"type":"send_online",
					"message":"isonline",

					"online":user.username,
				}
			)

	#called when ws has been closed

	async def disconnect(self,close_code):

		user = self.scope["user"]
		roomid = self.scope['url_route']['kwargs']['groupid']

		removeduser = await remove_online_user(user,roomid)


		await self.channel_layer.group_send(
					self.roomid,
				{
					"type":"send_offline",

					"message":"isoffline",
					"offline":user.username,
				}
			)
		
	# Recieve websocket request
	async def receive_json(self, content):

		command = content.get("command",None)

		try:
			if command == "chat_client":
				await self.receive_message(content["message_client"])


		except ClientError as e:
			await self.send_json({"error": e.code})

	#send recieved message to all clients in this group

	async def receive_message(self,message_client):

		user = self.scope["user"]
		ismember = await is_member(user,self.roomid)
		has_chat_permission = await chat_permission(user,self.roomid) 
		
		if ismember and has_chat_permission:

			#here we will store the message in our DB
			storedmessage = await store_message(user,message_client,self.roomid)

			await self.channel_layer.group_send(
				self.roomid,
				{
					"type":"send_message",
					"message":message_client,
					"command":"chat_client",
					"user":user.username,
				}
			)

		else:


			await self.send_json(
				{	
					"username":user.username,
					"message" : "you must be in the group and have permission to send messages!",
					"needed_permission" : "0"
				}
			)

	async def send_message(self, event):
		await self.send_json(
			{
				"msg_type":"send message",
				"message":event["message"],
				"command":event["command"],
				"user":event["user"],
			}
		)
	
	async def send_online(self, event):
		await self.send_json(
			{
				"msg_type":"send online",
				"message":event["message"],
				"online":event["online"],
			}
		)
	
	async def send_offline(self, event):
		await self.send_json(
			{
				"msg_type":"send offline",
				"message":event["message"],
				"offline":event["offline"],
			}
		)

