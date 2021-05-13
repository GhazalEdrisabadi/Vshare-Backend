# -*- coding: utf-8 -*-
from __future__ import unicode_literals
#from django.db import models
from django.contrib import admin
#from django.contrib.auth.admin import UserAdmin
from users.models import *

admin.site.register(Account)
admin.site.register(Friendship)
admin.site.register(FriendRequest)
admin.site.register(DirectMessage)
admin.site.register(Chat)