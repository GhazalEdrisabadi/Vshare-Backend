from django.urls import path
from users.views import *

from rest_framework.authtoken.views import obtain_auth_token

app_name = "users"

urlpatterns = [
    path('signup/', Registration.as_view(), name="Signup"),
    path('login/', UserLogin.as_view(), name="Login"),
    path('<str:username>/', UserByUsername.as_view(), name="detail"),
    path('relations/follow/', FriendshipList.as_view(), name="follow_operation"),
    path('relations/followers/', UserFollowers.as_view(), name="user_followers"),
    path('relations/followings/', UserFollowings.as_view(), name="user_followings"),

]