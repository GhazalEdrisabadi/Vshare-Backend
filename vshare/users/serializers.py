from rest_framework import serializers
from django.core.exceptions import ValidationError
from users.models import *
from django.db.models import Q
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from rest_framework import authentication
#from django.contrib.contenttypes.models import ContentType
from django.contrib.auth import get_user_model
import logging
import boto3
from botocore.exceptions import ClientError


class RegistrationSerializer(serializers.ModelSerializer):

	password2 = serializers.CharField(label='Confirm Password', style = {'input_type' : 'password'}, write_only=True)

	class Meta:
		model = Account
		fields = ['firstname','lastname','username','email','password','password2']
		extra_kwargs = {
				'password': {'write_only' : True}
		}

	def save(self):
		account = Account(
					email = self.validated_data['email'],
					username = self.validated_data['username'],
			)

		password = self.validated_data['password']
		password2 = self.validated_data['password2']

		if password != password2:
			raise serializers.ValidationError({'password':'Passwords must match.'})

		account.set_password(password)
		account.save()
		return account

class UserLoginSerializer(serializers.ModelSerializer):
	
	token = serializers.CharField(allow_blank=True, read_only=True)
	username = serializers.CharField(required=False, allow_blank=True)

	class Meta:
		model = Account
		fields = [
			'username',
			'password',
			'token'
		]
		extra_kwargs = {
				'password': {'write_only' : True}
		}

	def validate(self, data):
		user_obj = None
		username = data.get("username",None)
		email = data.get("email",None)
		password = data["password"]
	
		if not email and not username:
			raise ValidationError("A username or email is required to login.")

		user = Account.objects.filter(
			Q(email__iexact=username) |
			Q(username__iexact=username)
			).distinct()

		user = user.exclude(email__isnull=True).exclude(email__iexact='')

		
		if user.exists() and user.count() == 1:
			user_obj = user.first()
		else:
			raise ValidationError("This username or email is not valid.")

		if user_obj:
			if not user_obj.check_password(password):
				raise ValidationError("Incorrect credentials. please try again.")

		token, created = Token.objects.get_or_create(user=user_obj) 
		data["user"] = user_obj
		return data

class AccountSerializer(serializers.ModelSerializer):

    class Meta:
        model = Account
        fields = '__all__'


class UploadPhoto():

	# def create_bucket(self, bucket_name):
	# 	try:
	# 		s3_client = boto3.client('s3')
	# 		s3_client.create_bucket(Bucket=bucket_name)
	# 		return True
	# 	except ClientError as e:
	# 		logging.error(e)
	# 		return False

	def create_presigned_url(self, bucket_name, object_name, expiration=3600):

		s3_client = boto3.client('s3')
		try:
			response = s3_client.generate_presigned_url('get_object',
														Params={'Bucket': bucket_name,
																'Key': object_name},
														ExpiresIn=expiration)
		except ClientError as e:
			logging.error(e)
			return None

		return response


	def create_presigned_post(bucket_name, object_name,
								fields=None, conditions=None, expiration=3600):
		s3_client = boto3.client('s3')
		try:
			response = s3_client.generate_presigned_post(bucket_name,
														object_name,
														Fields=fields,
														Conditions=conditions,
														ExpiresIn=expiration)
		except ClientError as e:
			logging.error(e)
			return None

		return response

class EditProfileSerializer(serializers.ModelSerializer):

	password2 = serializers.CharField(
		required=False, 
		allow_blank=True,
		help_text='Confirm new password',
		label='Confirm Password',
		style = {'input_type' : 'password'}, 
		write_only=True
	)

	class Meta:
		model = Account
		fields = ['photo','email','password','password2']
		extra_kwargs = {
				'password': {'write_only' : True, 'allow_blank' : True, 'required':False},
				'password2':{'allow_blank' : True, 'required':False},
				'email':{'allow_blank' : True, 'required':False},
		}

	def update_info(self):
		account = Account(
				email = self.validated_data['email'],
				username = self.validated_data['username'],
			)

		password = self.validated_data['password']
		password2 = self.validated_data['password2']

		if password != password2:
			raise serializers.ValidationError({'password':'Passwords must match.'})

		account.set_password(password)
		account.save()
		return account
