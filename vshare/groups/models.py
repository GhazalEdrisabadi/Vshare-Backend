from django.db import models 
from django.contrib.auth.models import User
from pygments import highlight # new
from pygments.formatters.html import HtmlFormatter # new
from pygments.lexers import get_all_lexers, get_lexer_by_name # new
from pygments.styles import get_all_styles
from django.conf import settings
from django.core.validators import RegexValidator
from django import forms
from multiselectfield import MultiSelectField
from django.contrib.postgres.fields import ArrayField
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
    
    class Meta:
        ordering = ['since']
    
    def __str__(self):
        return self.groupid


class Membership(models.Model):
    the_member = models.ForeignKey(settings.AUTH_USER_MODEL,to_field='username',blank=True,null=True,on_delete=models.CASCADE)
    the_group = models.ForeignKey(Group,to_field='groupid', on_delete=models.CASCADE)
    date_joined = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['date_joined']
        unique_together = ("the_group", "the_member")
