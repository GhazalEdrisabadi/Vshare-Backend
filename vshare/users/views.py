# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render
#######################################
from django.db.models import Q
from django.contrib.auth import get_user_model

from rest_framework import status
from rest_framework.decorators import api_view
from users.serializers import *
from groups.serializers import GroupSerializer
from rest_framework.authtoken.models import Token

from users.models import *
from rest_framework import generics
from rest_framework import mixins

from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from rest_framework.views import APIView

from rest_framework.filters import (
		SearchFilter,
		OrderingFilter,
	)

from rest_framework.mixins import DestroyModelMixin, UpdateModelMixin
from rest_framework.generics import (
		CreateAPIView,
		DestroyAPIView,
		ListAPIView,
		UpdateAPIView,
		RetrieveAPIView,
		RetrieveUpdateAPIView
	)

from rest_framework.permissions import (
		AllowAny,
		IsAuthenticated,
		IsAdminUser,
		IsAuthenticatedOrReadOnly,
	)
import requests


class Registration(generics.ListCreateAPIView):
	permission_classes = [AllowAny]
	queryset = Account.objects.all()
	serializer_class = RegistrationSerializer

class UserLogin(APIView):
	permission_classes = [AllowAny]
	serializer_class = UserLoginSerializer

	def post(self,request,*args, **kwargs):
		data = request.data
		serializer = UserLoginSerializer(data=data)
		if serializer.is_valid(raise_exception=True):
			user = serializer.validated_data['user']
			token = Token.objects.get(user=user) 
			return Response(
				{
					'token': token.key, 
					'username':user.username,
					'email': user.email
				}, status=HTTP_200_OK
			)

		return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

class UserByUsername(generics.RetrieveUpdateDestroyAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    lookup_field = 'username'
    permission_classes = [AllowAny]

class EditProfile(generics.RetrieveUpdateAPIView):
  permission_classes = [IsAuthenticated]
  queryset = Account.objects.all()
  serializer_class = EditProfileSerializer
  lookup_field = 'username'

class UploadPhoto(mixins.DestroyModelMixin,
					mixins.CreateModelMixin,
					generics.GenericAPIView):

	permission_classes = [IsAuthenticated]
	queryset = Account.objects.all()
	serializer_class = UploadPhotoSerializer
	lookup_field = 'username'

	def perform_create(self, instance):
		print(instance)

	def create(self, request, *args, **kwargs):
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		self.perform_create(serializer)
		return Response(serializer.data, status=status.HTTP_201_CREATED)

	def post(self, request, *args, **kwargs):
		return self.create(request, *args, **kwargs)

	def perform_destroy(self, instance):
		instance.delete()

	def destroy(self, request, *args, **kwargs):
		instance = self.get_object()
		self.perform_destroy(instance)
		return Response(status=status.HTTP_204_NO_CONTENT)

	def delete(self, request, *args, **kwargs):
		return self.destroy(request, *args, **kwargs)

class ChangePassword(generics.RetrieveUpdateAPIView):
	queryset= Account.objects.all()
	serializer_class = ChangePasswordSerializer
	lookup_field = 'username'
	permission_classes = [IsAuthenticated]
