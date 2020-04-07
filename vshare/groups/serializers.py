from rest_framework import serializers
from .models import Group
from django.apps import apps

UserModel = apps.get_model('users', 'Account')


class GroupSerializer(serializers.ModelSerializer):

    class Meta:
        model = Group
        fields = '__all__'

# class GroupRegistrationSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = Group
#         fields = ['groupid','title','describtion','invite_only','created_by','members',]
    
#     def save(self):
#         group = Group(
#             groupid=self.validated_data['groupid'],
#             title=self.validated_data['title'],
#             describtion=self.validated_data['describtion'],
#             invite_only=self.validated_data['invite_only'],
#             created_by=self.validated_data['created_by'],
#             members=self.validated_data['members'],
#         )
#         group.save()
#         return group