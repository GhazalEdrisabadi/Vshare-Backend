from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from groups import views

urlpatterns = [
    path('groups/', views.GroupList.as_view(), name='all_groups_and_create'),
    path('groups/<str:groupid>/', views.GroupDetail.as_view(), name='group_detail'),
    path('group/join/',views.MembershipList.as_view(), name='membership'),
    path('group/add_member/',views.AddMembershipList.as_view(), name='Add_membership'),

]

urlpatterns = format_suffix_patterns(urlpatterns)
#---
