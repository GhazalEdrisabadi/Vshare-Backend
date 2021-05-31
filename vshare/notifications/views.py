from django.shortcuts import render
from .models import *
from .serializers import *
from django.contrib.auth.models import User
from rest_framework.permissions import *
from rest_framework.generics import *
from groups.models import *

class UserNotification(ListAPIView):
	serializer_class = NotificationSerializer
	permission_classes = [AllowAny]
	def get_queryset(self):
		user = self.request.user
		unseen = 0
		try:
			user_memberships = Membership.objects.filter(the_member=user)
			groups_have_notification = []
			print(user_memberships)

			for group in user_memberships:
				group_obj = group.the_group
				if group_obj.have_notice == True:
					groups_have_notification.append(group_obj)

			for group in groups_have_notification:
				owner = getattr(group, "created_by")
				unseen = Notification.objects.filter(notification_type=7, group=group, is_seen=False).count() + unseen

			if Notification.objects.filter(notification_type=6, receiver=user).exists():
				group_notice_count = Notification.objects.get(notification_type=6, receiver=user)
				group_notice_count.text_preview = str(unseen)
				group_notice_count.save()
			else:
				group_notice_count = Notification(notification_type=6, receiver=user)
				group_notice_count.text_preview = str(unseen)
				group_notice_count.save()
				
			notifications = Notification.objects.filter(receiver=user, is_seen=False).exclude(notification_type=1).exclude(notification_type=2).exclude(notification_type=6)

				
			friend_count_notify = Notification.objects.filter(notification_type=1, receiver=user)
			group_count_notify = Notification.objects.filter(notification_type=2, receiver=user)
			group_notice_count_notify = Notification.objects.filter(notification_type=6, receiver=user)
			
			if notifications:
				for notify in notifications:
					notify.is_seen = True
				notify_list = notifications.union(friend_count_notify, group_count_notify, group_notice_count_notify)
				return notify_list

			# There is no new notification
			else:
				# Oldest items first
				notifications = Notification.objects.filter(receiver=user, is_seen=True)
				last_10_notifications = notifications.order_by('date')[:10]
				notify_list = last_10_notifications.union(friend_count_notify, group_count_notify, group_notice_count_notify)
				return notify_list

		except Notification.DoesNotExist:
			raise 
