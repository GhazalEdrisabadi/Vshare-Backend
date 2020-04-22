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
	groupid = models.CharField(max_length=20, blank=False, null=False, validators=[alphanumeric], unique=True, default='')
	#groupid only contains alphanumerical characters
	title = models.CharField(max_length=100, blank=True, default='No Name')
	describtion = models.TextField(blank=True)
	invite_only = models.BooleanField(default=False)
	created_by = models.ForeignKey(settings.AUTH_USER_MODEL,to_field='username',blank=True,null=True,on_delete=models.CASCADE,related_name='owner')
	members = models.ManyToManyField(settings.AUTH_USER_MODEL,blank=True,related_name='joined_groups',through='Membership')
	
	#upper field should be modified. because right now, it's pointing to django's default superuser model

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

