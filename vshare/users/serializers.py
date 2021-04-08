from rest_framework import serializers
from django.core.exceptions import ValidationError
from users.models import *
from django.db.models import Q
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from rest_framework import authentication
from django.contrib.auth import get_user_model, authenticate
import logging
import boto3
from botocore.exceptions import ClientError
from users.utils import *
from django.contrib import auth
from rest_framework.exceptions import AuthenticationFailed
from rest_framework import exceptions
from allauth.account.models import EmailAddress

UserModel = get_user_model()
class UserDetailsSerializer(serializers.ModelSerializer):
    """
    User model w/o password
    """

    def validate_username(self, username):
        if 'allauth.account' not in settings.INSTALLED_APPS:
            # We don't need to call the all-auth
            # username validator unless its installed
            return username

        from allauth.account.adapter import get_adapter
        username = get_adapter().clean_username(username)
        return username

    class Meta:
        extra_fields = []
        # see https://github.com/iMerica/dj-rest-auth/issues/181
        # UserModel.XYZ causing attribute error while importing other
        # classes from `serializers.py`. So, we need to check whether the auth model has
        # the attribute or not
        if hasattr(UserModel, "USERNAME_FIELD"):
            extra_fields.append(UserModel.USERNAME_FIELD)
        if hasattr(UserModel, "EMAIL_FIELD"):
            extra_fields.append(UserModel.EMAIL_FIELD)

        model = UserModel
        fields = ('pk', *extra_fields, 'firstname', 'lastname')
        read_only_fields = ('email',)

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
					firstname = self.validated_data['firstname'],
					lastname = self.validated_data['lastname'],
			)

		password = self.validated_data['password']
		password2 = self.validated_data['password2']

		if password != password2:
			raise serializers.ValidationError({'password':'Passwords must match.'})

		account.set_password(password)
		account.save()
		return account

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    password = serializers.CharField(style={'input_type': 'password'})

    def authenticate(self, **kwargs):
        return authenticate(self.context['request'], **kwargs)

    def _validate_email(self, email, password):
        user = None

        if email and password:
            user = self.authenticate(email=email, password=password)
        else:
            msg = ('Must include "email" and "password".')
            raise exceptions.ValidationError(msg)

        return user

    def _validate_username(self, username, password):
        user = None

        if username and password:
            user = self.authenticate(username=username, password=password)
        else:
            msg = ('Must include "username" and "password".')
            raise exceptions.ValidationError(msg)

        return user

    def _validate_username_email(self, username, email, password):
        user = None

        if username and password:
            user2 = self.authenticate(username=username, password=password)
            user3 = self.authenticate(email=username, password=password)
            if user2:
                if EmailAddress.objects.filter(user=username, verified=True).exists() or EmailAddress.objects.filter(email=username, verified=True).exists():
                    user = user2
                else:
                    msg = ('This account is not activate.')
                    raise exceptions.ValidationError(msg)
            else:
                msg = ('username/email and password combination is not an active account.')
                raise exceptions.ValidationError(msg)
        else:
            msg = ('Must include either "username" or "email" and "password".')
            raise exceptions.ValidationError(msg)

        return user

    def get_auth_user_using_allauth(self, username, email, password):
        from allauth.account import app_settings

        # Authentication through email
        if app_settings.AUTHENTICATION_METHOD == app_settings.AuthenticationMethod.EMAIL:
            return self._validate_email(email, password)

        # Authentication through username
        if app_settings.AUTHENTICATION_METHOD == app_settings.AuthenticationMethod.USERNAME:
            return self._validate_username(username, password)

        # Authentication through either username or email
        return self._validate_username_email(username, email, password)

    def get_auth_user_using_orm(self, username, email, password):
        if email:
            try:
                username = UserModel.objects.get(email__iexact=email).get_username()
            except UserModel.DoesNotExist:
                pass

        if username:
            return self._validate_username_email(username, '', password)

        return None

    def get_auth_user(self, username, email, password):
        """
        Retrieve the auth user from given POST payload by using
        either `allauth` auth scheme or bare Django auth scheme.
        Returns the authenticated user instance if credentials are correct,
        else `None` will be returned
        """
        if 'allauth' in settings.INSTALLED_APPS:
            return self.get_auth_user_using_allauth(username, email, password)
        return self.get_auth_user_using_orm(username, email, password)

    def validate_auth_user_status(self, user):
        if not user.is_active:
            msg = _('User account is disabled.')
            raise exceptions.ValidationError(msg)

    def validate_email_verification_status(self, user):
        from allauth.account import app_settings
        if app_settings.EMAIL_VERIFICATION == app_settings.EmailVerificationMethod.MANDATORY:
            email_address = user.emailaddress_set.get(email=user.email)
            if not email_address.verified:
                raise serializers.ValidationError(_('E-mail is not verified.'))

    def validate(self, attrs):
        username = attrs.get('username')
        email = attrs.get('email')
        password = attrs.get('password')
        user = self.get_auth_user(username, email, password)

        if not user:
            msg = ('Unable to log in with provided credentials.')
            raise exceptions.ValidationError(msg)

        # Did we get back an active user?
        self.validate_auth_user_status(user)

        # If required, is the email verified?
        if 'dj_rest_auth.registration' in settings.INSTALLED_APPS:
            self.validate_email_verification_status(user)

        attrs['user'] = user
        return attrs

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = '__all__'

class UploadPhotoSerializer(serializers.ModelSerializer):

	class Meta(object):
		model = Account
		fields = ['username','photo']
		extra_kwargs = {
				'username': {'read_only' : True}
    }
    
  	# Cast the generated url of upload photo to dictionary
	def to_representation(self, instance):
		ret = super().to_representation(instance)
		user = self.context["request"].user
		upload_url = create_presigned_post('vshare-profile-images',user.username)
		ret["upload_photo"] = upload_url
		return ret
    
class EditProfileSerializer(serializers.ModelSerializer):
    
	photo_url = serializers.SerializerMethodField('get_photo_url')

	class Meta:
		model = Account
		fields = ['photo_url','email']
		extra_kwargs = {
				'email':{'allow_blank' : True, 'required':False},
		}
		
	def get_photo_url(self, obj):
		username = obj.username
		# if Account.objects.get(username=username).photo:
		return create_presigned_url('vshare-profile-images',username)
		# else:
		# 	raise ValidationError("User's photo is not found")

class ChangePasswordSerializer(serializers.ModelSerializer):
	confirm_password = serializers.CharField(write_only=True)
	new_password = serializers.CharField(write_only=True)

	class Meta:
		model = Account
		fields = ['username','new_password','confirm_password']
		extra_kwargs = {
				'username':{'read_only':True},
		}

	def update(self, instance, validated_data):

		if not self.validated_data['new_password']:
			raise serializers.ValidationError({'new_password': 'not found'})

		if not self.validated_data['confirm_password']:
			raise serializers.ValidationError({'confirm_password': 'not found'})

		if self.validated_data['new_password'] != self.validated_data['confirm_password']:
			raise serializers.ValidationError({'passwords': 'passwords do not match'})

		if self.validated_data['new_password'] == self.validated_data['confirm_password']:
			instance.set_password(validated_data['new_password'])
			instance.save()
			return instance
		return instance

class FriendshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friendship
        fields = '__all__'  