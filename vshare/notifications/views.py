from django.shortcuts import render
from .models import *
from .serializers import *
from django.contrib.auth.models import User
from rest_framework.permissions import *
from rest_framework.generics import *

class UserNotification(ListAPIView):
	serializer_class = NotificationSerializer
	permission_classes = [AllowAny]
	def get_queryset(self):
		user = self.request.user
		try:
			notifications = Notification.objects.filter(receiver=user, is_seen=False).exclude(notification_type=1)
			friend_count_notify = Notification.objects.filter(notification_type=1, receiver=user)
			
			if notifications:
				for notify in notifications:
					notify.is_seen = True
				notify_list = notifications.union(friend_count_notify)
				return notify_list

			# There is no new notification
			else:
				# Oldest items first
				last_10_notifications = notifications.order_by('date')[:10]
				notify_list = last_10_notifications.union(friend_count_notify)

				return notify_list

		except Notification.DoesNotExist:
			raise 
