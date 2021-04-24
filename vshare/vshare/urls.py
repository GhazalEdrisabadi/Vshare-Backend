"""vshare URL Configuration
The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.urls import include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_swagger.views import get_swagger_view
from dj_rest_auth.views import PasswordResetConfirmView, PasswordResetView


schema_view = get_swagger_view(title='my vshare project!')


urlpatterns = [
    path('swagger/', schema_view, name='openapi-schema'),
    path('admin/', admin.site.urls),
    path('user/', include('users.urls')),
    path('', include('groups.urls')),
    path('accounts/', include('allauth.urls')),
    path('auth/password/reset/confirm/<slug:uidb64>/<slug:token>/',PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
#urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)