from django.urls import path
from users.views import *

from rest_framework.authtoken.views import obtain_auth_token

app_name = "users"

urlpatterns = [
    path('signup/', Registration.as_view(), name="Signup"),
    path('login/', UserLogin.as_view(), name="Login"),
    path('<str:username>/', UserByUsername.as_view(), name="detail"),
    path('<str:username>/edit/upload_photo', UploadPhoto.as_view(), name="UploadPhoto")
]