from rest_framework import serializers
from .models import *
from django.apps import apps

UserModel = apps.get_model('users', 'Account')


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__' 


class GroupUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields =  ['groupid','title','describtion','invite_only','video_hash']

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