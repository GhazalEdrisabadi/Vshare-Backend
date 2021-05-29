from rest_framework import serializers
from .models import *
from django.apps import apps
from users.utils import *

UserModel = apps.get_model('users', 'Account')


class GroupSerializer(serializers.ModelSerializer):

	class Meta:
		model = Group
		fields = '__all__'

class GroupPhotoSerializer(serializers.ModelSerializer):
	
	photo_url = serializers.SerializerMethodField('get_photo_url')

	class Meta:
		model = Group
		fields = '__all__'

	def get_photo_url(self, obj):
		groupid = obj.groupid
		obj.photo_path = create_presigned_url('vshare-group-images', groupid)
		obj.save()
		return obj.photo_path 

class GroupUpdateSerializer(serializers.ModelSerializer):

	photo_url = serializers.SerializerMethodField('get_photo_url')

	class Meta:
		model = Group
		fields =  ['photo','photo_url','groupid','title','describtion','invite_only','video_hash']
		extra_kwargs = {
			'photo':{'read_only' : True},
		}

	def get_photo_url(self, obj):
		groupid = obj.groupid
		obj.photo_path = create_presigned_url('vshare-group-images', groupid)
		obj.save()
		return obj.photo_path 



class MembershipSerializer(serializers.ModelSerializer):
	def __init__(self, *args, **kwargs):
		many = kwargs.pop('many', True)
		super(MembershipSerializer, self).__init__(many=many, *args, **kwargs)
	class Meta:
		model = Membership
		fields = '__all__'  

class AcceptedClientSerializer(serializers.ModelSerializer):
	class Meta:
		model = AcceptedClient
		fields = '__all__'

class GroupRegistrationSerializer(serializers.ModelSerializer):
	created_by = serializers.HiddenField(default=serializers.CurrentUserDefault())
	class Meta:
		model = Group
		fields = ['groupid','title','describtion','invite_only','created_by','members',]
	
	def save(self):
		group = Group(
			groupid=self.validated_data['groupid'],
			title=self.validated_data['title'],
			describtion=self.validated_data['describtion'],
			invite_only=self.validated_data['invite_only'],
			created_by=self.context["request"].user,
			members=self.validated_data['members'],
		)
		group.save()
		return group

class MessageSerializer(serializers.ModelSerializer):
	class Meta:
		model = Message
		fields = '__all__'

class OnlineUserSerializer(serializers.ModelSerializer):
	class Meta:
		model = OnlineUser
		fields = '__all__'

class PermissionSerializer(serializers.ModelSerializer):
	class Meta:
		model = Permission
		fields = '__all__'

class InviteSerializer(serializers.ModelSerializer):
	def __init__(self, *args, **kwargs):
		many = kwargs.pop('many', True)
		super(InviteSerializer, self).__init__(many=many, *args, **kwargs)
	class Meta:
		model = Invite
		fields = '__all__'

class JoinRequestSerializer(serializers.ModelSerializer):
	def __init__(self, *args, **kwargs):
		many = kwargs.pop('many', True)
		super(JoinRequestSerializer, self).__init__(many=many, *args, **kwargs)
	class Meta:
		model = JoinRequest
		fields = '__all__'

class UploadPhotoSerializer(serializers.ModelSerializer):

	class Meta(object):
		model = Group
		fields = ['groupid','photo']
		extra_kwargs = {
				'groupid': {'read_only' : True}
		}
	
	# Cast the generated url of upload photo to dictionary
	def to_representation(self, instance):
		ret = super().to_representation(instance)
		request_obj = self.context['request']
		group_id = request_obj.query_params.get('groupid')
		upload_url = create_presigned_post('vshare-group-images',group_id)
		ret["upload_photo"] = upload_url
		return ret