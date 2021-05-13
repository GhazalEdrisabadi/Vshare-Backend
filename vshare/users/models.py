from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager , PermissionsMixin
from django.contrib.auth.models import User
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.tokens import RefreshToken
from django.dispatch import receiver
from allauth.account.signals import user_signed_up
from django.core.cache import cache
import datetime

class MyAccountManager(BaseUserManager):

	def create_user(self, email, username, password=None):

		if not email:
			raise ValueError('Users must have an email address')
		if not username:
			raise ValueError('Users must have a username')

		user = self.model(
			email=self.normalize_email(email),
			username=username,
		)

		user.set_password(password)
		user.save(using=self._db)
		return user

	def create_superuser(self, email, username, password):
		
		user = self.create_user(
			email=self.normalize_email(email),
			password=password,
			username=username,
		)

		user.is_admin = True
		user.is_staff = True
		user.is_superuser = True
		user.is_active = True
		user.save(using=self._db)
		return user

class Account(AbstractBaseUser,PermissionsMixin):
	# notice the absence of a "Password field", that's built in.
	photo_path = models.URLField(max_length=200, null=True, blank=True)
	photo = models.BooleanField(default=False)
	firstname = models.CharField(max_length=50)
	lastname = models.CharField(max_length=50)
	bio = models.CharField(max_length=80, default="Hi there! Now available on vshare.")
	username = models.CharField(max_length=20, primary_key=True)#primary_key=True
	email = models.EmailField(max_length=100, unique=True)
	is_private = models.BooleanField(default=False)
	is_verified = models.BooleanField(default=False)
	is_admin = models.BooleanField(default=False)	# a superuser
	is_active = models.BooleanField(default=True)
	is_staff = models.BooleanField(default=False)	# a admin user; non super-user
	is_superuser = models.BooleanField(default=False)
	
	USERNAME_FIELD = 'username'
	REQUIRED_FIELDS = ['email']
	

	objects = MyAccountManager()

	def __str__(self):
		return self.username
		
	# For checking permissions. to keep it simple all admin have all permissions
	def has_perm(self, perm, obj=None):
		return self.is_admin

	#Does this user have permission to view this app?(ALWAYS YES FOR SIMPLICITY)
	def has_module_perms(self, app_label):
		return True

	def tokens(self):
		refresh = RefreshToken.for_user(self)
		return {
			'refresh' : str(refresh),
			'access' : str(refresh.access_token)
		}
	
#returns users last seen
	def last_seen(self):
		return cache.get('seen_%s' % self.username)

#checks if user online or offline
	def online(self):
		if self.last_seen():
			now = datetime.datetime.now()
			if now > self.last_seen() + datetime.timedelta(seconds=settings.USER_ONLINE_TIMEOUT):
				return False
			else:
				return True
		else:
			return False


class Friendship(models.Model):
	who_follows = models.ForeignKey(settings.AUTH_USER_MODEL,to_field='username',blank=True,null=True,on_delete=models.CASCADE,related_name="top")
	who_is_followed = models.ForeignKey(settings.AUTH_USER_MODEL,to_field='username',blank=True,null=True,on_delete=models.CASCADE,related_name="bot")
	the_date = models.DateTimeField(auto_now_add=True)
	class Meta:
		ordering = ['the_date']
		unique_together = ("who_follows", "who_is_followed")

class FriendRequest(models.Model):
	sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="request_sender")
	receiver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="request_receiver")
	is_active = models.BooleanField(blank=True, null=False, default=False)
	timestamp = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return self.sender.username

	def accept(self):
		# Accept a friend request : Update both SENDER and RECEIVER friend lists
		friendship = Friendship(who_follows=self.sender, who_is_followed=self.receiver)
		friendship.save()
		self.is_active = False
		self.save()

	def decline(self):
		# Decline a friend request : It is "declined" by setting the 'is_active' field to False
		self.is_active = False
		self.save()

	def cancel(self):
		self.is_active = False
		self.save()

