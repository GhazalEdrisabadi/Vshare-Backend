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
alphanumeric = RegexValidator(r'^[0-9a-zA-Z]*$', 'Only alphanumeric characters are allowed.')


class Group(models.Model):
	since = models.DateTimeField(auto_now_add=True)
	groupid = models.CharField(max_length=20, blank=False, null=False, validators=[alphanumeric], unique=True, default='')
	#groupid only contains alphanumerical characters
	title = models.CharField(max_length=100, blank=True, default='No Name')
	describtion = models.TextField(blank=True)
	invite_only = models.BooleanField(default=False)
	created_by = models.ForeignKey(
	    settings.AUTH_USER_MODEL,
	    verbose_name='Created by',
	    blank=True, null=True,
	    related_name="%(app_label)s_%(class)s_created",
	    on_delete=models.SET_NULL)
	members = models.ManyToManyField(settings.AUTH_USER_MODEL,blank=True)
	#upper field should be modified. because right now, it's pointing to django's default superuser model
	
	class STATUS(Enum):
		initial = (0, 'no action')
		selected = (1, 'video selected by owner')
		validation = (2, 'check validation')
		played = (3, 'video played by owner')

		@classmethod
		def get_value(cls, member):
			return member.value[0]

	status = models.CharField(
		max_length=32,
		choices=[x.value for x in STATUS],
		default=STATUS.get_value(STATUS.initial)
	)
    
	class Meta:
		ordering = ['since']


	def __str__(self):
		return self.title

	# Check a user is a member of group
	@property
	def is_member(self):
		UserModel = apps.get_model('users', 'Account')
		user = UserModel.objects.get(username=username)
		if user in self.members:
			return True
		else:
			return False

	# Check a member is a creator or not
	@property
	def is_creator(self):
		UserModel = apps.get_model('users', 'Account')
		user = UserModel.objects.get(username=username)
		if user.is_member and user == self.created_by:
			return True
		else:
			return False

	#Return a unique channels.Group for each group through groupid
	@property
	def group_name(self):
		return "room-%s" % self.title

	# def set_state(self, commend):
	# 	if command == 'video selected by owner':
	# 		self.STATUS.status = 1
	# 	elif command == 'check validation':
	# 		self.STATUS.status = 2
	# 	elif command == 'video played by owner':
	# 		self.STATUS.status = 3
	# 	else
	# 		self.STATUS.status = 0
