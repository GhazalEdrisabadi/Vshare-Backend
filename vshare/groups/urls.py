from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from groups import views

urlpatterns = [
    path('groups/', views.GroupList.as_view(), name='all_groups_and_create'),
    path('groups/<str:groupid>/', views.GroupDetail.as_view(), name='group_detail'),
    path('groups/<str:groupid>/edit/', views.GroupDetailUpdate.as_view(), name='group_detail_with_update'),
    path('group/join/',views.MembershipList.as_view(), name='membership'),
    path('group/add_member/',views.AddMembershipList.as_view(), name='Add_membership'),
    path('group/joined_groups/',views.GroupsOfUser.as_view(), name='groups_of_user'),
    path('group/owned_groups/',views.GroupsWhichUserIsAdmin.as_view(), name='owned_by_user'),
    path('group/<str:the_group>/leave/',views.DeleteMembership.as_view(), name='leave'),

]

urlpatterns = format_suffix_patterns(urlpatterns)
#---
