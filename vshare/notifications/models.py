from django.db import models
from django.contrib.auth.models import User
from django.conf import settings

# Create your models here.
class Notification(models.Model):
	NOTIFICATION_TYPES = ((1, 'Friend-Requests-Count'), (2, 'Group-Requests-Count'),
		(3, 'Friend-Request-State'), (4, 'Group-Request-State'), (5, 'New-Follower'))
	sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notify_from_user")
	receiver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notify_to_user")
	text_preview = models.CharField(max_length=100, blank=True)
	notification_type = models.IntegerField(choices=NOTIFICATION_TYPES)
	date = models.DateTimeField(auto_now_add=True)
	is_seen = models.BooleanField(default=False)