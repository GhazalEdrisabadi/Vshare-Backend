from django.contrib import admin
from .models import Group , Membership
from users.models import Account

admin.site.register(Group)