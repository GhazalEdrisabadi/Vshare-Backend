from rest_framework import serializers
from .models import *

class NotificationSerializer(serializers.ModelSerializer):
	class Meta:
		model = Notification
		fields = ['notification_type','sender','receiver',
			'text_preview','date','is_seen']
		extra_kwargs = {
			'notification_type':{'read_only':True},
			'sender':{'read_only':True},
			'receiver':{'read_only':True},
			'text_preview':{'read_only':True},
			'date':{'read_only':True},
			'is_seen':{'read_only':True},
		}