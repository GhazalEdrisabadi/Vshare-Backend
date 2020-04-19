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

	async def connect (self):

		user = self.scope["user"]
		print(user)
		roomid = self.scope['url_route']['kwargs']['groupid']
		print(roomid)
		room = await get_room(roomid)
		ismember = await is_member(user,roomid)
		print(ismember)

		# Check user logged in or is in the group
		if user.is_anonymous:
			await self.close()
		else:
			await self.accept()

	async def receive_json(self, content):

		await self.send_json(
			{
				"message":"hello front!",
			}
		)


	#async def disconnect(self, close_code):
