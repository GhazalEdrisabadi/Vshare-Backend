from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from groups import views
from groups.views import *

urlpatterns = [
    path('groups/', views.GroupList.as_view()),
    path('groups/<str:groupid>/', views.GroupDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
#---
