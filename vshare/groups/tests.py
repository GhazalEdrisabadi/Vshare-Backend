import json

from users.models import Account
from groups.models import Group
from django.test import TestCase

from rest_framework.test import APITestCase, force_authenticate


class SnippetTestCase(APITestCase):
    def setUp(self):
        self.username = 'amin_test'
        self.password = '12345amin'
        self.email = 'foo@yahoo.com'
        self.is_active = True
        self.account1 = Account.objects.create(username=self.username, password=self.password, email=self.email, is_active=self.is_active)
        self.client.force_authenticate(user=self.account1)


    def test_1(self): #GET groups list empty
        response = self.client.get('/group/', {}, format='json')
        print(response.data)
        print(response.status_code)
        self.assertEqual(response.status_code, 200)

    def test_2(self): #GET groups list non-empty
        self.account1 = Account.objects.get(username='amin_test')
        self.group1 = Group.objects.create(groupid='group_test', title='hello test case', created_by=self.account1)
        response = self.client.get('/group/', {}, format='json')
        print(response.data)
        print(response.status_code)
        self.assertEqual(response.status_code, 200)

    def test_3(self): #POST membership object
        self.account1 = Account.objects.get(username='amin_test')
        self.group1 = Group.objects.create(groupid='group_test', title='hello test case', created_by=self.account1)
        self.account2 = Account.objects.create(username='amir_test', password='12345amin', email='dummy@yahoo.com', is_active=True)
        response = self.client.post('/group/invite/', {'group':'group_test', 'recipient':'amir_test'}, format='json')
        print(response.data)
        print(response.status_code)
        self.assertEqual(response.status_code, 201)

    def test_4(self): #POST membership object and GET non-empty list
        self.account1 = Account.objects.get(username='amin_test')
        self.group1 = Group.objects.create(groupid='group_test', title='hello test case', created_by=self.account1)
        self.account2 = Account.objects.create(username='amir_test', password='12345amin', email='dummy@yahoo.com', is_active=True)
        self.client.force_authenticate(user=self.account1)
        response_temp = self.client.post('/group/invite/', {'group':'group_test', 'recipient':'amir_test'}, format='json')
        self.client.force_authenticate(user=self.account2)
        response = self.client.get('/group/invite-list/', {}, format='json')
        print(response.data)
        print(response.status_code)
        self.assertEqual(response.status_code, 200)
    
    def test_4(self): #POST group object
        self.account1 = Account.objects.get(username='amin_test')
        #self.group1 = Group.objects.create(groupid='group_test', title='hello test case', created_by=self.account1)
        self.client.force_authenticate(user=self.account1)
        response = self.client.post('/group/', {'groupid':'group43454ctest', 'title':'hello test case'}, format='json')
        print(response.data)
        print(response.status_code)
        self.assertEqual(response.status_code, 201)

    def test_5(self): #POST group object and PUT group object
        self.account1 = Account.objects.get(username='amin_test')
        self.client.force_authenticate(user=self.account1)
        response_tmp = self.client.post('/group/', {'groupid':'group43454ctest', 'title':'hello test case'}, format='json')
        response = self.client.put('/group/group43454ctest/edit/', {'title':'put test'}, format='json')        
        print(response.data)
        print(response.status_code)
        self.assertEqual(response.status_code, 200)
