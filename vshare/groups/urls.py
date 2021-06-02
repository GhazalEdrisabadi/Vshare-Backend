from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from groups import views
from groups.views import *

urlpatterns = [
    path('detail/<str:groupid>/', views.GroupDetail.as_view(), name='group_by_groupid'),
    path('', views.GroupList.as_view(), name='all_groups_and_create'),
    path('<str:groupid>/get-photo-path/', views.GroupPhoto.as_view(), name='generate_path_of_photo'),
    path('upload-photo/', UploadPhoto.as_view(), name='upload_change_delete_photo'),
    path('<str:groupid>/edit/', views.GroupDetailUpdate.as_view(), name='group_detail_with_update'),
    path('add-member/',views.AddMembershipList.as_view(), name='Add_membership'),
    path('joined-groups/',views.GroupsOfUser, name='groups_of_user'),
    path('owned-groups/',views.GroupsWhichUserIsAdmin.as_view(), name='owned_by_user'),
    path('<str:the_group>/leave/',views.DeleteMembership.as_view(), name='leave'),
    path('ready-to-watch/',views.AcceptedClientList.as_view(), name='users_ready_to_watch'),
    path('ready-to-watch/<str:accepted_client>/',views.AcceptedClientDetail.as_view(), name='ready_to_watch'),
    path('users-ready-to-watch/<str:entered_group>/',views.GroupAcceptedClientDetail.as_view(), name='group_users_ready_to_watch'),
    path('messages/', views.MessageHistory.as_view(), name='all_messages'),
    path('online-users/', views.OnlineUserList.as_view(), name='online_users'),
    path('permissions/', views.PermissionList.as_view(), name='Permission_list'),
    path('<str:group>/permissions/', views.DeletePermission.as_view(), name='Permission_detail_delete'),
    path('user-groups/',views.GroupsOfSearchedUser.as_view(), name='owned_by_a_user'),
    path('invite/',views.AddInviteList, name='invite_user_to_group'),
    path('invitation/<str:group>/',views.DeleteInvite, name='acc_dec_invite'),
    path('join/', views.JoinGroup, name="join"),
    path('accept-join/', views.AcceptJoinRequest, name="accept_join_request"),
    path('invite-list/', views.UserInvitesList, name="user_invite_list"),
    path('join-requests/', views.GroupJoinRequestsList, name="group_join_requests_list"),
    path('top-groups/', views.TopGroups, name="top_15_groups"),
    path('preview/', GroupUsersPermissions, name="Group_users_permissions"),
    path('set-notice/', GroupNotice, name="set_group_notice")
]

urlpatterns = format_suffix_patterns(urlpatterns)