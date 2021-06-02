from django.db import models 
from django.contrib.auth.models import User
from pygments import highlight
from pygments.formatters.html import HtmlFormatter
from pygments.lexers import get_all_lexers, get_lexer_by_name
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
	photo_path = models.URLField(max_length=200, null=True, blank=True)
	photo = models.BooleanField(default=False)
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
	aux_count = models.IntegerField(blank=True ,default=0)
	have_notice = models.BooleanField(default=False)

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

	privacy0 = 0
	privacy1 = 1
	privacy2 = 2

	PrivacyChoice = (
		(privacy0, _('Every body can see it and join')),
		(privacy1, _('Semi Private, everybody can see it but needs acceptance to join')),
		(privacy2, _('Fully private, no one can see it and can only join it via invitation')),
	)

	privacy = models.PositiveSmallIntegerField(
		choices=PrivacyChoice,
		default=privacy0,
	)
    
	class Meta:
		ordering = ['aux_count']


	def __str__(self):
		return self.groupid

	#Return a unique channels.Group for each group through groupid
	@property
	def group_id(self):
		return "room-%s" % self.groupid

	@property
	def group_status(self):
		return self.status
	
	def update_aux_count(self):
		members_of_group = Membership.objects.filter(the_group = self.groupid)
		members_count = members_of_group.count()
		self.aux_count = members_count
		self.save()
		return self.aux_count


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

class Invite(models.Model):
	group = models.ForeignKey(Group, to_field="groupid" , on_delete=models.CASCADE)
	recipient = models.ForeignKey(settings.AUTH_USER_MODEL,to_field='username',blank=True,null=True,on_delete=models.CASCADE)
	date_set = models.DateTimeField(auto_now_add=True)
	class Meta:
		ordering = ['date_set']
		unique_together = ("recipient", "group")

class JoinRequest(models.Model):
	group = models.ForeignKey(Group, to_field="groupid" , on_delete=models.CASCADE)
	sender = models.ForeignKey(settings.AUTH_USER_MODEL,to_field='username',blank=True,null=True,on_delete=models.CASCADE)
	date_set = models.DateTimeField(auto_now_add=True)
	class Meta:
		ordering = ['date_set']
		unique_together = ("sender", "group")