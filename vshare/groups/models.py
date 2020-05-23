from django.db import models 
from django.contrib.auth.models import User
from pygments import highlight # new
from pygments.formatters.html import HtmlFormatter # new
from pygments.lexers import get_all_lexers, get_lexer_by_name # new
from pygments.styles import get_all_styles
from django.conf import settings
from django.core.validators import RegexValidator
from django import forms
from django.contrib.postgres.fields import ArrayField
from django.apps import apps
from enum import Enum
from django.utils.translation import gettext as _

alphanumeric = RegexValidator(r'^[0-9a-zA-Z]*$', 'Only alphanumeric characters are allowed.')


class Group(models.Model):
	since = models.DateTimeField(auto_now_add=True)
	groupid = models.CharField(max_length=20, blank=False, null=False, validators=[alphanumeric], unique=True, default='',)
	#groupid only contains alphanumerical characters
	title = models.CharField(max_length=100, blank=True, default='No Name',)
	describtion = models.TextField(blank=True,)
	invite_only = models.BooleanField(default=False,)
	created_by = models.ForeignKey(settings.AUTH_USER_MODEL,to_field='username',blank=True,null=True,on_delete=models.CASCADE,related_name='owner',)
	members = models.ManyToManyField(settings.AUTH_USER_MODEL,blank=True,related_name='joined_groups',through='Membership',)
	video_hash = models.CharField(max_length=100, blank=True ,default='No hash yet!')
	hash_sender = models.ForeignKey(settings.AUTH_USER_MODEL,to_field='username',blank=True,null=True,on_delete=models.CASCADE,related_name='sender',)
	
	def save(self,*args,**kwargs):
		created = self.pk is None
		super(Group,self).save(*args, **kwargs)
		if created:
			created_group = Group.objects.get(groupid=self.groupid)
			owner_to_members=Membership(the_group=created_group , the_member=created_group.created_by)
			owner_to_members.save()
			default_permit=Permission(group=created_group , member=created_group.created_by , chat_permission=True , playback_permission=True , choose_video_permission=True)
			default_permit.save()

	state0 = 0
	state1 = 1
	state2 = 2

	StatusChoice = (
		(state0, _('video was not selected by owner')),
		(state1, _('video validation is checking')),
		(state2, _('video is playing')),
	)


	status = models.PositiveSmallIntegerField(
		choices=StatusChoice,
		default=state0,
	)
    
	class Meta:
		ordering = ['since']


	def __str__(self):
		return self.groupid

	#Return a unique channels.Group for each group through groupid
	@property
	def group_id(self):
		return "room-%s" % self.groupid

	@property
	def group_status(self):
		return self.status


class Membership(models.Model):
    the_member = models.ForeignKey(settings.AUTH_USER_MODEL,to_field='username',blank=True,null=True,on_delete=models.CASCADE)
    the_group = models.ForeignKey(Group,to_field='groupid', on_delete=models.CASCADE)
    date_joined = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['date_joined']
        unique_together = ("the_group", "the_member")

class AcceptedClient(models.Model):
	entered_group = models.ForeignKey(Group, to_field="groupid" , on_delete=models.CASCADE)
	accepted_client = models.ForeignKey(settings.AUTH_USER_MODEL,to_field='username',blank=True,null=True,on_delete=models.CASCADE)
	recieved_hash = models.CharField(max_length=100,default='No hash yet!')
	date_accepted = models.DateTimeField(auto_now_add=True)
	class Meta:
		ordering = ['date_accepted']
		unique_together = ("entered_group", "accepted_client")

class Message(models.Model):
	message_text = models.CharField(max_length=100, blank=True, default='',)
	target_group = models.ForeignKey(Group, to_field="groupid" , on_delete=models.CASCADE)
	message_sender = models.ForeignKey(settings.AUTH_USER_MODEL,to_field='username',blank=True,null=True,on_delete=models.CASCADE)
	date_sent = models.DateTimeField(auto_now_add=True)
	class Meta:
		ordering = ['-date_sent']

class OnlineUser(models.Model):
	online_user = models.ForeignKey(settings.AUTH_USER_MODEL,to_field='username',blank=True,null=True,on_delete=models.CASCADE)
	joined_group = models.ForeignKey(Group, to_field="groupid" , on_delete=models.CASCADE)
	data_joined = models.DateTimeField(auto_now_add=True)
	class Meta:
		ordering = ['data_joined']
		unique_together = ("joined_group", "online_user")

class Permission(models.Model):
	member = models.ForeignKey(settings.AUTH_USER_MODEL,to_field='username',blank=True,null=True,on_delete=models.CASCADE)
	group = models.ForeignKey(Group, to_field="groupid" , on_delete=models.CASCADE)
	chat_permission = models.BooleanField(default=True,)
	choose_video_permission = models.BooleanField(default=False,)
	playback_permission = models.BooleanField(default=False,)
	date_set = models.DateTimeField(auto_now_add=True)
	class Meta:
		ordering = ['date_set']
		unique_together = ("member", "group")
