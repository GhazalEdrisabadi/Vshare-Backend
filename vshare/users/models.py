from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager , PermissionsMixin

from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

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
		user.save(using=self._db)
		return user

class Account(AbstractBaseUser,PermissionsMixin):
	# notice the absence of a "Password field", that's built in.
	photo = models.BooleanField(default=False)
	firstname = models.CharField(max_length=50)
	lastname = models.CharField(max_length=50)
	username = models.CharField(max_length=20, primary_key=True)#primary_key=True
	email = models.EmailField(max_length=100, unique=True)
	#email verification
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

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
	if created:
		Token.objects.create(user=instance)

class Friendship(models.Model):
	who_follows = models.ForeignKey(settings.AUTH_USER_MODEL,to_field='username',blank=True,null=True,on_delete=models.CASCADE,related_name="top")
	who_is_followed = models.ForeignKey(settings.AUTH_USER_MODEL,to_field='username',blank=True,null=True,on_delete=models.CASCADE,related_name="bot")
	the_date = models.DateTimeField(auto_now_add=True)
	class Meta:
		ordering = ['the_date']
		unique_together = ("who_follows", "who_is_followed")
