from django.urls import path
from users.views import *
from django.urls import include
from dj_rest_auth.registration.views import VerifyEmailView, ConfirmEmailView, LoginView
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

app_name = "users"

urlpatterns = [
    
    path('information/', UserInformation.as_view(), name="user details"),
    path('<str:username>/edit_profile/upload_photo/', UploadPhoto.as_view(), name="UploadPhoto"),
    path('<str:username>/edit_profile/', EditProfile.as_view(), name="Edit Profile"),
    path('<str:username>/edit_profile/change_password/', ChangePassword.as_view(), name="Change Password"),
    path('find/username/', UserSugestion.as_view(), name="find_with_sugestion"),
    path('relations/follow/', FriendshipList.as_view(), name="follow_operation"),
    path('relations/followers/', UserFollowers.as_view(), name="user_followers"),
    path('relations/followings/', UserFollowings.as_view(), name="user_followings"),
    path('followers/find/<str:who_follows>/', FindFollower.as_view(), name="search_follower"),
    path('followings/find/<str:who_is_followed>/', FindFollowing.as_view(), name="search_following"),
    path('followers/unfollow/<str:who_is_followed>/', UnfollowUser.as_view(), name="search_follower"),
    path('auth/registration/account-confirm-email/<str:key>/',ConfirmEmailView.as_view(),),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
    path('dj-rest-auth/account-confirm-email/',VerifyEmailView.as_view(),name='account_email_verification_sent'),
    path('auth/login/',LoginView.as_view(),name='account_login'),
    path('relations/online_followings/',UserOnlineFollowings,name='online_followings'),
    path('relations/offline_followings/',UserOfflineFollowings,name='offline_followings'),
    ]