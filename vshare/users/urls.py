from django.urls import path
from users.views import *
from django.urls import include
from dj_rest_auth.registration.views import VerifyEmailView, ConfirmEmailView, LoginView
from dj_rest_auth.views import PasswordResetConfirmView, PasswordResetView
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

app_name = "users"

urlpatterns = [
    
    path('<str:username>/information/', UserDetail.as_view(), name="user_info_with_lookup_field"),
    path('information/', UserInformation.as_view(), name="user_info_with_jwt"),
    path('<str:username>/edit-profile/', EditProfile.as_view(), name="edit_user_profile"),
    path('<str:username>/edit-profile/upload-photo/', UploadPhoto.as_view(), name="upload_change_delete_photo"),
    path('<str:username>/edit-profile/change-password/', ChangePassword.as_view(), name="change_password"),
    path('find/username/', UserSugestion.as_view(), name="find_with_sugestion"),
    path('relations/follow/', FollowRequest, name="follow_operation"),
    path('relations/followers/', UserFollowers.as_view(), name="user_followers"),
    path('relations/followings/', UserFollowings.as_view(), name="user_followings"),
    path('followers/find/<str:who_follows>/', FindFollower.as_view(), name="search_follower"),
    path('followings/find/<str:who_is_followed>/', FindFollowing.as_view(), name="search_following"),
    path('followers/unfollow/<str:who_is_followed>/', UnfollowUser.as_view(), name="unfollow_user"),
    path('auth/registration/account-confirm-email/<str:key>/',ConfirmEmailView.as_view(),),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
    path('auth/account-confirm-email/',VerifyEmailView.as_view(),name="account_email_verification_sent"),
    path('auth/password-reset/', PasswordResetView.as_view()),
    path('auth/login/',LoginView.as_view(),name="account_login"),
    path('relations/online-followings/',UserOnlineFollowings,name="online_followings"),
    path('relations/offline-followings/',UserOfflineFollowings,name="offline_followings"),
    path('relations/follow-requests/',FriendRequestList.as_view(),name="friend_requests"),
    path('relations/request/',AccOrDecFriendRequest, name="accept_decline_follow_request"),
    path('direct-message/',DirectMessageList.as_view(), name='messages_history'),
    path('chat-list/',ChatList, name='messages_history'),
    ]