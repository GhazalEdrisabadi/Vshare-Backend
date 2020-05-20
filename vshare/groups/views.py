from rest_framework import generics
from .models import *
from users.models import Account
from .serializers import GroupRegistrationSerializer
from .serializers import *
from rest_framework import filters
from rest_framework import status
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view 
from rest_framework.decorators import permission_classes
from django.views.decorators.csrf import csrf_protect
from django.contrib.auth.models import User
from groups.pagination import CustomPagination


from rest_framework.permissions import (
		AllowAny,
		IsAuthenticated,
		IsAdminUser,
		IsAuthenticatedOrReadOnly,
	)

class PermissionList(generics.ListCreateAPIView):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    permission_classes = [AllowAny]

class DeletePermission(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PermissionSerializer
    permission_classes = [AllowAny]
    lookup_field='group'
    def get_queryset(self):
        the_member= self.request.query_params.get('member')
        the_permit= self.request.query_params.get('permit')
        queryset = Permission.objects.filter(member=the_member,permit=the_permit)
        return queryset

class OnlineUserList(generics.ListAPIView):
    #queryset = OnlineUser.objects.all()
    serializer_class = OnlineUserSerializer
    permission_classes = [AllowAny]
    def get_queryset(self):
        queryset = OnlineUser.objects.all()
        the_group = self.request.query_params.get('group','')
        return queryset.filter(joined_group=the_group)


class MessageHistory(generics.ListAPIView):
    #queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [AllowAny]
    def get_queryset(self):
        queryset = Message.objects.all()
        the_group = self.request.query_params.get('target','')
        return queryset.filter(target_group=the_group)
    pagination_class = CustomPagination
      
class GroupList(generics.ListCreateAPIView):
    search_fields = ['groupid']
    filter_backends = (filters.SearchFilter,)
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [AllowAny]
    def perform_create(self, serializer):
        req = serializer.context['request']
        serializer.save(created_by=req.user)


class GroupDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    lookup_field = 'groupid'
    permission_classes = [AllowAny]

class GroupDetailUpdate(generics.RetrieveUpdateDestroyAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupUpdateSerializer
    lookup_field = 'groupid'
    permission_classes = [AllowAny]
    def perform_update(self, serializer):
        req = serializer.context['request']
        serializer.save(the_member=req.user)


class MembershipList(generics.ListCreateAPIView):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    permission_classes = [AllowAny]
    def perform_create(self, serializer):
        req = serializer.context['request']
        serializer.save(the_member=req.user)

class AddMembershipList(generics.ListCreateAPIView):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    permission_classes = [AllowAny]

class GroupsOfUser(generics.ListAPIView):
    serializer_class = MembershipSerializer

    def get_queryset(self):
        """
        This view should return a list of all the records
        for the currently authenticated user.
        """
        user = self.request.user
        return Membership.objects.filter(the_member=user)
        
class GroupsWhichUserIsAdmin(generics.ListAPIView):
    serializer_class = GroupSerializer

    def get_queryset(self):
        """
        This view should return a list of all the records
        for the currently authenticated user.
        """
        user = self.request.user
        return Group.objects.filter(created_by=user)

class DeleteMembership(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MembershipSerializer
    permission_classes = [AllowAny]
    lookup_field='the_group'
    def get_queryset(self):
        user = self.request.user
        #group_identifier= self.request.query_params.get('group_id')
        queryset = Membership.objects.filter(the_member=user)
        return queryset

class GroupList(generics.ListCreateAPIView):
    search_fields = ['groupid']
    filter_backends = (filters.SearchFilter,)
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [AllowAny]
    def perform_create(self, serializer):
        req = serializer.context['request']
        serializer.save(created_by=req.user)


class AcceptedClientDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = AcceptedClient.objects.all()
    serializer_class = AcceptedClientSerializer
    lookup_field = 'accepted_client'
    permission_classes = [AllowAny]

class GroupAcceptedClientDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = AcceptedClient.objects.all()
    serializer_class = AcceptedClientSerializer
    lookup_field = 'entered_group'
    permission_classes = [AllowAny]

class AcceptedClientList(generics.ListCreateAPIView):
    queryset = AcceptedClient.objects.all()
    serializer_class = AcceptedClientSerializer
    permission_classes = [AllowAny]

'''
class GroupsOfUser(generics.ListCreateAPIView):
	queryset = Group.objects.all()
	queryset.account_set.all()
	serializer_class = GroupSerializer
	lookup_field = 'Account.username'
	permission_classes = [AllowAny]
'''
@api_view(['POST',])
@permission_classes([AllowAny])
@csrf_protect
def GroupRegistration(request):
    #context = RequestContext(request)
    if request.method =='POST':
        serializer_class = GroupRegistrationSerializer(data=request.data)
        data = {}
        if serializer_class.is_valid():
            account = serializer_class.save()
            data['response'] = 'Successfully created'
            data['groupid'] = account.groupid
            data['title'] = account.title
            data['describtion'] = account.describtion
            data['invite_only'] = account.invite_only
            data['created_by'] = account.created_by
            data['members'] = account.members
        else:
            data = serializer_class.errors
        return Response(data)