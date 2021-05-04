from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from notifications.views import *

urlpatterns = [
    path('notifications/', UserNotification.as_view(), name='user-notifications'),
]

urlpatterns = format_suffix_patterns(urlpatterns)