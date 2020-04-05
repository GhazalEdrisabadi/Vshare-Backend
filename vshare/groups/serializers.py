from rest_framework import serializers
from .models import Group


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
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
        
     
