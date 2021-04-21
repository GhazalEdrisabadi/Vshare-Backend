from django.contrib import admin
from .models import *
from users.models import Account

admin.site.register(Group)
admin.site.register(Membership)
admin.site.register(AcceptedClient)
admin.site.register(Message)
admin.site.register(OnlineUser)
admin.site.register(Permission)
admin.site.register(Invite)
admin.site.register(JoinRequest)