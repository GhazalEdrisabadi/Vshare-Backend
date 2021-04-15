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
from rest_framework.schemas import get_schema_view
from django.views.generic import TemplateView


schema_view = get_schema_view(title='Vshare API', description='This is the OpenAPI for Vshare.')
template_view = TemplateView.as_view(template_name='documentation.html',extra_context={'schema_url':'openapi-schema'})

urlpatterns = [
    path('openapi/', schema_view, name='openapi-schema'),
    path('swagger/', template_view, name='swagger-ui'),
    path('admin/', admin.site.urls),
    path('user/', include('users.urls')),
    path('', include('groups.urls')),
    path('accounts/', include('allauth.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)