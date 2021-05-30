from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from users.models import *
from groups.models import *

# Create your models here.
class Notification(models.Model):
	NOTIFICATION_TYPES = ((1, 'Friend-Requests-Count'), (2, 'Group-Requests-Count'),
		(3, 'Friend-Request-State'), (4, 'Group-Request-State'), (5, 'New-Follower'), 
		(6, 'Group-Notice-Count'), (7, 'Group-Notice'))
	sender = models.ForeignKey(settings.AUTH_USER_MODEL, to_field='username', on_delete=models.CASCADE, related_name="notify_from_user", null=True, blank=True)
	receiver = models.ForeignKey(settings.AUTH_USER_MODEL, to_field='username', on_delete=models.CASCADE, related_name="notify_to_user", null=True, blank=True)
	text_preview = models.CharField(max_length=100, blank=True)
	notification_type = models.IntegerField(choices=NOTIFICATION_TYPES)
	date = models.DateTimeField(auto_now_add=True)
	is_seen = models.BooleanField(default=False)


	def update_friend_requests_count(self):
		requests = FriendRequest.objects.filter(receiver=self.receiver, is_active=True)							
		self.text_preview = str(requests.count())
		self.save()


	def update_group_requests_count(self):
		join_requests = JoinRequest.objects.all()
		counter = 0
		print(join_requests)
		for request in join_requests:
			group = str(request.group)
			print(group)
			if Group.objects.filter(created_by=self.receiver, groupid=group).exists():
				counter = counter + 1
		self.text_preview = str(counter)
		self.save()