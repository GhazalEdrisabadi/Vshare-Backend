
# -*- coding: utf-8 -*-
#subs backend
from __future__ import unicode_literals
from django.shortcuts import render

from django.db.models import Q
from django.contrib.auth import get_user_model

from rest_framework import status
from rest_framework.decorators import api_view
from users.serializers import *
from groups.serializers import GroupSerializer
from rest_framework.authtoken.models import Token

from users.models import *
from notifications.models import *
from rest_framework import generics
from rest_framework import mixins

from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from rest_framework.views import APIView

from rest_framework import filters

from rest_framework.filters import (
		SearchFilter,
		OrderingFilter,
	)

from rest_framework.mixins import DestroyModelMixin, UpdateModelMixin
from rest_framework.generics import (
		CreateAPIView,
		DestroyAPIView,
		ListAPIView,
		UpdateAPIView,
		RetrieveAPIView,
		RetrieveUpdateAPIView
	)

from rest_framework.permissions import (
		AllowAny,
		IsAuthenticated,
		IsAdminUser,
		IsAuthenticatedOrReadOnly,
	)
import requests

from rest_framework_simplejwt.tokens import RefreshToken
from .utils import Util
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
import jwt
from django.conf import settings
from django.views.decorators.csrf import csrf_protect

# User info with lookup field
class UserDetail(generics.RetrieveAPIView):
	queryset = Account.objects.all()
	serializer_class = AccountSerializer
	permission_classes = [AllowAny]
	lookup_field = 'username'


# User info with jwt token
class UserInformation(generics.ListAPIView):
	serializer_class = AccountSerializer
	permission_classes = [AllowAny]
	def get_queryset(self):
		user = self.request.user
		queryset = Account.objects.filter(username=user)
		return queryset

class EditProfile(generics.RetrieveUpdateAPIView):
	queryset = Account.objects.all()
	serializer_class = EditProfileSerializer
	permission_classes = [IsAuthenticated]
	lookup_field = 'username'

class UploadPhoto(mixins.DestroyModelMixin,
					mixins.CreateModelMixin,
					generics.GenericAPIView):
  
	permission_classes = [IsAuthenticated]
	queryset = Account.objects.all()
	serializer_class = UploadPhotoSerializer
	lookup_field = 'username'

	def perform_create(self, instance):
		user = instance.context['request'].user
		if not user.photo:
			user.photo = True
		user.save()

	def create(self, request, *args, **kwargs):
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		self.perform_create(serializer)
		return Response(serializer.data, status=status.HTTP_201_CREATED)

	def post(self, request, *args, **kwargs):
		return self.create(request, *args, **kwargs)

	def perform_destroy(self, instance):
		if instance.photo:
			instance.photo = False

	def destroy(self, request, *args, **kwargs):
		instance = self.get_object()
		self.perform_destroy(instance)
		return Response(status=status.HTTP_204_NO_CONTENT)

	def delete(self, request, *args, **kwargs):
		return self.destroy(request, *args, **kwargs)
  
class UserSugestion(generics.ListCreateAPIView):
    search_fields = ['username','firstname','lastname']
    filter_backends = (filters.SearchFilter,)
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = [AllowAny]

class FriendshipList(generics.ListCreateAPIView):
	queryset = Friendship.objects.all()
	serializer_class = FriendshipSerializer
	permission_classes = [AllowAny]
	def perform_create(self, serializer):
		req = serializer.context['request']
		serializer.save(who_follows=req.user)

@api_view(['POST'])
def FollowRequest(request):
	user = request.user
	requested_user_param = request.query_params.get('user_id')
	if Account.objects.filter(username=requested_user_param).exists():
		receiver = Account.objects.get(username=requested_user_param)
		if Friendship.objects.filter(who_follows=user, who_is_followed=receiver).exists():
			response = {'Error':'You have already followed this user.'}
			return Response(response, status=status.HTTP_400_BAD_REQUEST)
		else:
			if receiver.is_private :
				try:
					# Get any friend requests (active and non-active)
					friend_requests = FriendRequest.objects.filter(sender=user, receiver=receiver)

					# Find if any of them are active
					try:
						for request in friend_requests:
							if request.is_active:
								raise Exception("You already sent them a friend request.")

						# If none are active, then create a new friend request
						friend_request = FriendRequest(sender=user, receiver=receiver)
						friend_request.is_active = True
						friend_request.save()

						friends_count_notification = Notification.objects.filter(notification_type=1, receiver=receiver)

						if friends_count_notification:
							friends_count_notification = Notification.objects.get(notification_type=1, receiver=receiver)
							friends_count_notification.update_friend_requests_count()

						# There are no notification for friend requests count so create
						else:
							requests = FriendRequest.objects.filter(receiver=receiver, is_active=True)
							new_notify = Notification(notification_type=1, receiver=receiver)
							new_notify.text_preview = str(requests.count())
							new_notify.save()

						response = {'Success':'Friend request sent.'}
						return Response(response, status=status.HTTP_200_OK)

					except Exception as e:
						raise

				except FriendRequest.DoesNotExist:
					# There are no friend requests so create one
					friend_request = FriendRequest(sender=user, receiver=receiver)
					friend_request.is_active = True
					friend_request.save()

					friends_count_notification = Notification.objects.filter(notification_type=1, receiver=receiver)

					if friends_count_notification:
						friends_count_notification = Notification.objects.get(notification_type=1, receiver=receiver)
						friends_count_notification.update_friend_requests_count()

					else:
						requests = FriendRequest.objects.filter(receiver=receiver, is_active=True)
						new_notify = Notification(notification_type=1, receiver=receiver)
						new_notify.text_preview = str(requests.count())
						new_notify.save()

					response = {'Success':'Friend request sent.'}
					return Response(response, status=status.HTTP_200_OK)
			else:
				friendship = Friendship(who_follows=user, who_is_followed=receiver)
				friendship.save()
				notification = Notification(notification_type=5, sender=user, receiver=receiver)
				notification.text_preview = str(sender) + " started following you."
				notification.save()
				response = {'Success':'You started following this user.'}
				return Response(response, status=status.HTTP_200_OK)
	else:
		response = {'Error':'This user is not exist.'}
		return Response(response, status=status.HTTP_400_BAD_REQUEST)

class UserFollowers(ListAPIView):
	#queryset = OnlineUser.objects.all()
	serializer_class = FriendshipSerializer
	permission_classes = [AllowAny]
	def get_queryset(self):
		queryset = Friendship.objects.all()
		get_param = self.request.query_params.get('user','')
		return queryset.filter(who_is_followed=get_param)
	def list(self, request, *args, **kwargs):
		get_param = self.request.query_params.get('user','')
		queryset = Friendship.objects.all()
		queryset = queryset.filter(who_is_followed=get_param)
		serializer = self.get_serializer(queryset, many=True)
		response_data = {'followers_count': queryset.count(),'result': serializer.data}
		return Response(response_data)

class UserFollowings(ListAPIView):
	#queryset = OnlineUser.objects.all()
	serializer_class = FriendshipSerializer
	permission_classes = [AllowAny]
	def get_queryset(self):
		queryset = Friendship.objects.all()
		get_param = self.request.query_params.get('user','')
		return queryset.filter(who_follows=get_param)
	def list(self, request, *args, **kwargs):
		get_param = self.request.query_params.get('user','')
		queryset = Friendship.objects.all()
		queryset = queryset.filter(who_follows=get_param)
		serializer = self.get_serializer(queryset, many=True)
		response_data = {'followings_count': queryset.count(),'result': serializer.data}
		return Response(response_data)


class FindFollower(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = FriendshipSerializer
	permission_classes = [AllowAny]
	lookup_field = 'who_follows'
	def get_queryset(self):
		following = self.request.user
		queryset = Friendship.objects.filter(who_is_followed=following)
		return queryset

class FindFollowing(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = FriendshipSerializer
	permission_classes = [AllowAny]
	lookup_field = 'who_is_followed'
	def get_queryset(self):
		following = self.request.user
		queryset = Friendship.objects.filter(who_follows=following)
		return queryset

class UnfollowUser(generics.DestroyAPIView):
	serializer_class = FriendshipSerializer
	permission_classes = [AllowAny]
	lookup_field = 'who_is_followed'
	def get_queryset(self):
		follower = self.request.user
		queryset = Friendship.objects.filter(who_follows=follower)
		return queryset

class ChangePassword(generics.RetrieveUpdateAPIView):
	queryset= Account.objects.all()
	serializer_class = ChangePasswordSerializer
	lookup_field = 'username'
	permission_classes = [IsAuthenticated]

@api_view(['Get'])
def UserOnlineFollowings(request):
	friendships = Friendship.objects.filter(who_follows = request.user)
	friends_online = []
	for obj in friendships:
		the_friend = Account.objects.get(username=obj.who_is_followed)
		if the_friend.online() == True:
			print(the_friend.last_seen())
			friends_online.append(obj.who_is_followed)
		else:
			pass
	friends = Account.objects.filter(username__in = friends_online)
	serializer = AccountSerializer(friends, many=True)
	return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['Get'])
def UserOfflineFollowings(request):
	friendships = Friendship.objects.filter(who_follows = request.user)
	friends_offline = []
	for obj in friendships:
		the_friend = Account.objects.get(username=obj.who_is_followed)
		if the_friend.online() == False:
			friends_offline.append(obj.who_is_followed)
		else:
			pass
	friends = Account.objects.filter(username__in = friends_offline)
	serializer = AccountSerializer(friends, many=True)
	return Response(serializer.data, status=status.HTTP_200_OK)

# Return follow requests for private accounts
class FriendRequestList(ListAPIView):
	serializer_class = FriendRequestSerializer
	permission_classes = [AllowAny]
	def get_queryset(self):
		user = self.request.user
		if user.is_private:
			try:
				friend_requests = FriendRequest.objects.filter(receiver=user, is_active=True)
				if not friend_requests.exists():
					raise Exception("You have no active request.")
				return friend_requests

			except FriendRequest.DoesNotExist:
				raise
		else:
			raise Exception("This is a public account")

	def list(self, request, *args, **kwargs):
		user = self.request.user
		if user.is_private:
			friend_requests = FriendRequest.objects.filter(receiver=user, is_active=True)
			serializer = self.get_serializer(friend_requests, many=True)
			response = {'follow requests': friend_requests.count(),'result': serializer.data}
			return Response(response)
		else:
			raise Exception("This is a public account")

# Accept or Decline a friend request for private accounts
@api_view(['POST'])
def AccOrDecFriendRequest(request):
	user = request.user
	state = request.query_params.get('state')
	sender = request.query_params.get('userid')
	sender_obj = Account.objects.get(username=sender)
	try:
		friend_request = FriendRequest.objects.get(sender=sender, receiver=user, is_active=True)
		if state == 'acc':
			friend_request.accept()
			receiver_notification = Notification(notification_type=5, sender=sender_obj, receiver=user)
			receiver_notification.text_preview = sender + " started following you."
			receiver_notification.save()

			sender_notification = Notification(notification_type=3, sender=user, receiver=sender_obj)
			sender_notification.text_preview = str(user) + " accepted your follow request."
			sender_notification.save()

			friends_count_notification = Notification.objects.filter(notification_type=1, receiver=user)

			if friends_count_notification:
				friends_count_notification = Notification.objects.get(notification_type=1, receiver=user)
				friends_count_notification.update_friend_requests_count()

			else:
				requests = FriendRequest.objects.filter(receiver=user, is_active=True)
				new_notify = Notification(notification_type=1, receiver=user)
				new_notify.text_preview = str(requests.count())
				new_notify.save()

			response = {'Success':'You accepted this follow request.'}
			return Response(response, status=status.HTTP_200_OK)

		elif state == 'dec':
			friend_request.decline()
			sender_notification = Notification(notification_type=3, sender=user, receiver=sender_obj)
			sender_notification.text_preview = str(user) + " declined your follow request."
			sender_notification.save()

			friends_count_notification = Notification.objects.filter(notification_type=1, receiver=user)

			if friends_count_notification:
				friends_count_notification = Notification.objects.get(notification_type=1, receiver=user)
				friends_count_notification.update_friend_requests_count()

			else:
				requests = FriendRequest.objects.filter(receiver=user, is_active=True)
				new_notify = Notification(notification_type=1, receiver=user)
				new_notify.text_preview = str(requests.count())
				new_notify.save()

			response = {'Success':'You declined this follow request.'}
			return Response(response, status=status.HTTP_200_OK)

		else:
			response = {'Error':'You should enter a valid status.'}
			return Response(response, status=status.HTTP_400_BAD_REQUEST)

	except FriendRequest.DoesNotExist:
			response = {'Error':'Friend request does not exist'}
			return Response(response, status=status.HTTP_400_BAD_REQUEST)
