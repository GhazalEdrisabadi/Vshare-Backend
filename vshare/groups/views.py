from rest_framework import generics
from .models import *
from users.models import *
from users.serializers import *
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
from rest_framework.views import APIView
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_201_CREATED, HTTP_403_FORBIDDEN, HTTP_404_NOT_FOUND
from django.http import QueryDict
from django.db.models import Q

from rest_framework.permissions import (
		AllowAny,
		IsAuthenticated,
		IsAdminUser,
		IsAuthenticatedOrReadOnly,
	)
from rest_framework import mixins


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
        queryset = Permission.objects.filter(member=the_member)
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


@api_view(['POST'])
def JoinGroup(request):
    temp = {'the_group' : request.data['the_group'], 'the_member' : request.user.username}
    data2 = QueryDict('', mutable=True)
    data2.update(temp)
    serializer = MembershipSerializer(data = data2)
    print(data2)
    if serializer.is_valid():
        group_identifier = request.data['the_group']
        if Group.objects.filter(groupid = group_identifier).exists():
            if Group.objects.get(groupid = group_identifier).privacy == 0:# non private
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            elif Group.objects.get(groupid = group_identifier).privacy == 1:#semi private
                group_obj = Group.objects.get(groupid=request.data['the_group'])
                new_join_request = JoinRequest(group=group_obj, sender=request.user)
                new_join_request.save()
                response_data = {'message':'Join request sent.', }
                return Response(response_data, status=status.HTTP_201_CREATED)
            elif Group.objects.get(groupid = group_identifier).privacy == 2:#fully private
                response_data = {'message':'This group is private. you are not able to join',}
                return Response(response_data, status=status.HTTP_403_FORBIDDEN)
            else:
                response_data = {'error':'Bad Request!',}
                return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
        else:
            response_data = {'error':'Group not found!',}
            return Response(response_data, status=status.HTTP_404_NOT_FOUND)
    else:
        response_data = {'error':'Bad Request! maybe wrong group.',}
        return Response(response_data, status=status.HTTP_400_BAD_REQUEST)



class AddMembershipList(generics.ListCreateAPIView):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    permission_classes = [AllowAny]

class GroupsOfSearchedUser(generics.ListAPIView):
    serializer_class = MembershipSerializer
    permission_classes = [AllowAny]
    def get_queryset(self):
        user = self.request.user
        requested_user_param = self.request.query_params.get('user_id')
        if Membership.objects.filter(the_member = requested_user_param).exists():
            requested_user = Account.objects.filter(username = requested_user_param)
        if Friendship.objects.filter(
            who_is_followed__in = requested_user,
            who_follows = user
            ).exists() or requested_user.filter(is_private = False):
            return Membership.objects.filter(the_member = requested_user_param)
        else:
            return

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
    search_fields = ['groupid', 'title']
    filter_backends = (filters.SearchFilter,)
    queryset = Group.objects.filter(privacy__in=[0,1])
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

class AddInviteList(generics.ListCreateAPIView):
    queryset = Invite.objects.all()
    serializer_class = InviteSerializer
    permission_classes = [AllowAny]

class DeleteInvite(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = InviteSerializer
    permission_classes = [AllowAny]
    lookup_field='group'
    def get_queryset(self):
        user_identifier = self.request.user
        decision_identifier = self.request.query_params.get('decision')
        group_identifier = self.request.query_params.get('group')
        if decision_identifier == 'acc':
            group_obj = Group.objects.get(groupid=group_identifier)
            new_membership_obj = Membership(the_member=user_identifier, the_group=group_obj)
            new_membership_obj.save()
        elif decision_identifier == 'dec':
            pass
        queryset = Invite.objects.filter(recipient=user_identifier)
        return queryset

@api_view(['POST'])
def AcceptJoinRequest(request):
    check_obj = JoinRequest.objects.filter(group=request.data['group'], sender=request.data['sender'])
    decision = request.data['decision']
    if check_obj.exists():
        group_obj = Group.objects.get(groupid=request.data['group'])
        if group_obj.created_by == request.user:
            if decision == 'acc':
                group_obj = Group.objects.get(groupid=request.data['group'])
                user_obj = Account.objects.get(username=request.data['sender'])
                new_membership = Membership(the_member=user_obj, the_group=group_obj)
                new_membership.save()
                check_obj.delete()
                response_data = {'message':'Join request accepted.',}
                return Response(response_data, status=status.HTTP_202_ACCEPTED)
            elif decision == 'dec':
                check_obj.delete()
                response_data = {'message':'Join request declined.',}
                return Response(response_data, status=status.HTTP_202_ACCEPTED)
            else:
                response_data = {'error':'use acc to accept and dec to decline.',}
                return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
        else:
            response_data = {'error':'Only owner of the group can accept join requests.',}
            return Response(response_data, status=status.HTTP_403_FORBIDDEN)
    else:
        response_data = {'error':'Bad request!',}
        return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

@api_view(['Get'])
def UserInvitesList(request):
    the_user = request.user
    invites = Invite.objects.filter(recipient=the_user).order_by('date_set')
    serializer = InviteSerializer(invites, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['Get'])
def GroupJoinRequestsList(request):
    the_user = request.user
    join_requests = JoinRequest.objects.filter(group=request.data['group'])
    serializer = JoinRequestSerializer(join_requests, many=True)
    group_obj = Group.objects.filter(groupid=request.data['group'], created_by=the_user)
    if group_obj.exists():
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        response_data = {'error':'Only owner can see join requests.'}
        return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

@api_view(['Get'])
def GroupJoinRequestsList(request):
    the_user = request.user
    join_requests = JoinRequest.objects.filter(group=request.data['group'])
    serializer = JoinRequestSerializer(join_requests, many=True)
    group_obj = Group.objects.filter(groupid=request.data['group'], created_by=the_user)
    if group_obj.exists():
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        response_data = {'error':'Only owner can see join requests.'}
        return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

@api_view(['Get'])
def GroupsOfUser(request):
    memberships = Membership.objects.filter(the_member=request.user)
    groups = []
    for obj in memberships:
        groups.append(obj.the_group)
    groups_obj = Group.objects.filter(groupid__in = groups)
    serializer = GroupSerializer(groups_obj, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['Get'])
def TopGroups(request):
    info = []
    groups_sorted = []
    groups = Group.objects.all()
    if groups.count() == 0:
        response_data = {'info':'There are no groups to choose.'}
        return Response(response_data, status=status.HTTP_200_OK)
    for obj in groups:
        memberships = Membership.objects.filter(the_group=obj.groupid)
        count = memberships.count()
        info.append([count,obj.groupid])      
    info.sort(key=lambda x: int(x[0]))
    info.reverse()
    for l in info:
        groups_sorted.append(l[1])
    flag = min(15,len(groups_sorted))
    top_15_id = groups_sorted[:flag]
    for i in top_15_id:
        obj = Group.objects.filter(groupid=i)
        obj[0].update_aux_count()
    top_15_group = Group.objects.filter(groupid__in=top_15_id).order_by('-aux_count')
    serializer = GroupSerializer(top_15_group, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


class UploadPhoto(mixins.DestroyModelMixin,
                    mixins.CreateModelMixin,
                    generics.GenericAPIView):
  
    permission_classes = [IsAuthenticated]
    queryset = Group.objects.all()
    serializer_class = UploadPhotoSerializer

    def perform_create(self, instance):
        request_obj = instance.context["request"]
        group_id = request_obj.query_params.get('groupid')
        group = Group.objects.get(groupid=group_id)
        if not group.photo:
            group.photo = True
        group.save()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def perform_destroy(self, instance):
        if instance.photo:
            instance.photo = False

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

@api_view(['Get'])
def GroupUsersPermissions(request):
    group_identifier = request.query_params.get('group')
    if Group.objects.filter(groupid=group_identifier).exists():
        group_obj = Group.objects.get(groupid=group_identifier)
        group_serializer = GroupSerializer(group_obj)
        permission_objs = Permission.objects.filter(group=group_identifier)
        permission_serializer = PermissionSerializer(permission_objs, many=True)
        response_data = {
            'group':group_serializer.data,
            'users&permissions':permission_serializer.data,
        }
        return Response(response_data, status=status.HTTP_200_OK)
    else:
        response_data = {
            'error':'group does not exist!'
        }
        return Response(response_data, status=status.HTTP_404_NOT_FOUND)