# -*- coding: utf-8 -*-
from __future__ import unicode_literals
#from django.db import models
from django.contrib import admin
#from django.contrib.auth.admin import UserAdmin
from users.models import MyAccountManager,Account,Friendship

admin.site.register(Account)
admin.site.register(Friendship)