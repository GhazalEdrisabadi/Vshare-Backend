from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from groups import views
from groups.views import *

urlpatterns = [
    path('groups/', views.GroupList.as_view(), name='groups_list'),
    path('groups/<str:groupid>/', views.GroupDetail.as_view(), name='group_by_groupid'),
    path('groups/', views.GroupList.as_view(), name='all_groups_and_create'),
    path('groups/<str:groupid>/', views.GroupDetail.as_view(), name='group_detail'),
    path('groups/<str:groupid>/edit/', views.GroupDetailUpdate.as_view(), name='group_detail_with_update'),
    path('group/add_member/',views.AddMembershipList.as_view(), name='Add_membership'),
    path('group/joined_groups/',views.GroupsOfUser.as_view(), name='groups_of_user'),
    path('group/owned_groups/',views.GroupsWhichUserIsAdmin.as_view(), name='owned_by_user'),
    path('group/<str:the_group>/leave/',views.DeleteMembership.as_view(), name='leave'),
    path('group/ready_to_watch/',views.AcceptedClientList.as_view(), name='users_ready_to_watch'),
    path('group/ready_to_watch/<str:accepted_client>/',views.AcceptedClientDetail.as_view(), name='ready_to_watch'),
    path('group/users_ready_to_watch/<str:entered_group>/',views.GroupAcceptedClientDetail.as_view(), name='group_users_ready_to_watch'),
    path('group/messages/', views.MessageHistory.as_view(), name='all_messages'),
    path('group/online_users/', views.OnlineUserList.as_view(), name='online_users'),
    path('group/permissions/', views.PermissionList.as_view(), name='Permission_list'),
    path('group/<str:group>/permissions/', views.DeletePermission.as_view(), name='Permission_detail_delete'),
    path('group/user_groups/',views.GroupsOfSearchedUser.as_view(), name='owned_by_a_user'),
    path('group/invite/',views.AddInviteList.as_view(), name='invite_user_to_group'),
    path('group/invitation/<str:group>/',views.DeleteInvite.as_view(), name='acc_dec_invite'),
    path('group/join/', views.JoinGroup, name="join"),
    path('group/accept_join/', views.AcceptJoinRequest, name="accept_join_request"),
]

urlpatterns = format_suffix_patterns(urlpatterns)