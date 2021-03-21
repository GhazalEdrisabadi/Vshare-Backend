from django.urls import path
from users.views import *

from rest_framework.authtoken.views import obtain_auth_token
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

app_name = "users"

urlpatterns = [
    path('signup/', Registration.as_view(), name="Signup"),
    path('email-verify/', VerifyEmail.as_view(), name="email-verify"), 
    path('login/', UserLogin.as_view(), name="Login"),
    path('<str:username>/', UserByUsername.as_view(), name="detail"),
    path('<str:username>/edit_profile/upload_photo/', UploadPhoto.as_view(), name="UploadPhoto"),
    path('<str:username>/edit_profile/', EditProfile.as_view(), name="Edit Profile"),
    path('<str:username>/edit_profile/change_password/', ChangePassword.as_view(), name="Change Password"),
    path('find/username/', UserByUsernameSugestion.as_view(), name="find_with_sugestion"),
    path('relations/follow/', FriendshipList.as_view(), name="follow_operation"),
    path('relations/followers/', UserFollowers.as_view(), name="user_followers"),
    path('relations/followings/', UserFollowings.as_view(), name="user_followings"),
    path('followers/find/<str:who_follows>/', FindFollower.as_view(), name="search_follower"),
    path('followings/find/<str:who_is_followed>/', FindFollowing.as_view(), name="search_following"),
    path('followers/unfollow/<str:who_is_followed>/', UnfollowUser.as_view(), name="search_follower"),
    ]
