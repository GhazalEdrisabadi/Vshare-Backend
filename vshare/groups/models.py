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
	groupid = models.CharField(max_length=20, blank=False, null=False, validators=[alphanumeric], unique=True, default='',)
	#groupid only contains alphanumerical characters
	title = models.CharField(max_length=100, blank=True, default='No Name',)
	describtion = models.TextField(blank=True,)
	invite_only = models.BooleanField(default=False,)
	created_by = models.ForeignKey(settings.AUTH_USER_MODEL,to_field='username',blank=True,null=True,on_delete=models.CASCADE,related_name='owner',)
	members = models.ManyToManyField(settings.AUTH_USER_MODEL,blank=True,related_name='joined_groups',through='Membership',)
	video_hash = models.CharField(max_length=100, blank=True ,default='No hash yet!')
	
	def save(self,*args,**kwargs):
		created = self.pk is None
		super(Group,self).save(*args, **kwargs)
		if created:
			created_group = Group.objects.get(groupid=self.groupid)
			owner_to_members=Membership(the_group=created_group , the_member=created_group.created_by)
			owner_to_members.save()

	# class STATUS(Enum):
	# 	initial = (0, 'no action')
	# 	selected = (1, 'video selected by owner')
	# 	validation = (2, 'check validation')
	# 	played = (3, 'video played by owner')

	# 	@classmethod
	# 	def get_value(cls, member):
	# 		return member.value[0]

	# status = models.CharField(
	# 	max_length=32,
	# 	choices=[x.value for x in STATUS],
	# 	default=STATUS.get_value(STATUS.initial)
	# )
    
	class Meta:
		ordering = ['since']


	def __str__(self):
		return self.groupid

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

class Membership(models.Model):
    the_member = models.ForeignKey(settings.AUTH_USER_MODEL,to_field='username',blank=True,null=True,on_delete=models.CASCADE)
    the_group = models.ForeignKey(Group,to_field='groupid', on_delete=models.CASCADE)
    date_joined = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['date_joined']
        unique_together = ("the_group", "the_member")

