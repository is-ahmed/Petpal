from django.shortcuts import render, get_object_or_404
from rest_framework.generics import CreateAPIView, RetrieveUpdateAPIView, RetrieveAPIView, \
    RetrieveUpdateDestroyAPIView, ListAPIView
from rest_framework.response import Response
from .seralizers import SeekerSerializer, ShelterSerializer, AdminSerializer
from .models import Seeker, Shelter, User
from rest_framework.permissions import AllowAny, IsAuthenticated

from rest_framework.pagination import PageNumberPagination
from rest_framework.exceptions import ValidationError, PermissionDenied

from applications.models import Application
# Create your views here.
class Admins(CreateAPIView, RetrieveUpdateDestroyAPIView):
    serializer_class =AdminSerializer 

    def get_permissions(self):
        self.permission_classes = [IsAuthenticated]
        if self.request.method == 'POST':
            self.permission_classes = [AllowAny]
        return super().get_permissions()

    def get_object(self):
        if hasattr(self.request.user, 'admin'):
            return self.request.user.admin
        else:
            raise PermissionDenied

    def perform_create(self, serializer):
        if len(User.objects.filter(username=serializer.validated_data['user']['username'])) != 0:
            raise ValidationError({'username': 'Username already exists.'})

        password1 = serializer.validated_data.pop('password1', '')
        password2 = serializer.validated_data.pop('password2', '')

        if not password1 or not password2:
            raise ValidationError({'password': 'Missing password.'})

        if password1 != password2:
            raise ValidationError({'password': 'Passwords are not the same.'})

        if len(password1) < 8:
            raise ValidationError({'password': 'Password should be at least 8 digits long.'})

        serializer.validated_data['user']['password'] = password1
        user = User.objects.create_user(**serializer.validated_data['user'], account_type='admin')
        serializer.save(user=user)

    def perform_update(self, serializer):
        if self.request.user.account_type != 'admin':
            raise PermissionDenied

        if len(User.objects.filter(username=serializer.validated_data['user']['username']).exclude(\
                username=self.request.user.username)) != 0:
            raise ValidationError({'username': 'Username already exists.'})


        password1 = serializer.validated_data.pop('password1', '')
        password2 = serializer.validated_data.pop('password2', '')

        if password1:
            if password1 != password2:
                raise ValidationError({'password': 'Passwords are not the same.'})

            if len(password1) < 8:
                raise ValidationError({'password': 'Password should be at least 8 digits long.'})

            self.request.user.set_password(password1)

        user_info = serializer.validated_data['user']
        username = user_info.get('username', '')
        if not username:
            raise ValidationError({'username': 'Username must not be empty'})
        else:
            self.request.user.username = username

        email = user_info.get('email', '')
        if not email:
            raise ValidationError({'email': 'Email must not be empty'})
        else:
            self.request.user.email = email

        avatar = serializer.validated_data.pop('avatar', '')

        if avatar:
            self.request.user.admin.avatar = avatar

        self.request.user.save()
        self.request.user.admin.save()


class Seekers(CreateAPIView, RetrieveUpdateDestroyAPIView):
    serializer_class = SeekerSerializer

    def get_permissions(self):
        self.permission_classes = [IsAuthenticated]
        if self.request.method == 'POST':
            self.permission_classes = [AllowAny]
        return super().get_permissions()

    def get_object(self):
        if hasattr(self.request.user, 'seeker'):
            return self.request.user.seeker
        else:
            raise PermissionDenied

    def perform_create(self, serializer):
        if len(User.objects.filter(username=serializer.validated_data['user']['username'])) != 0:
            raise ValidationError({'username': 'Username already exists.'})

        password1 = serializer.validated_data.pop('password1', '')
        password2 = serializer.validated_data.pop('password2', '')

        if not password1 or not password2:
            raise ValidationError({'password': 'Missing password.'})

        if password1 != password2:
            raise ValidationError({'password': 'Passwords are not the same.'})

        if len(password1) < 8:
            raise ValidationError({'password': 'Password should be at least 8 digits long.'})

        serializer.validated_data['user']['password'] = password1
        user = User.objects.create_user(**serializer.validated_data['user'], account_type='seeker')
        serializer.save(user=user)

    def perform_update(self, serializer):
        if self.request.user.account_type != 'seeker':
            raise PermissionDenied

        if len(User.objects.filter(username=serializer.validated_data['user']['username']).exclude(\
                username=self.request.user.username)) != 0:
            raise ValidationError({'username': 'Username already exists.'})


        password1 = serializer.validated_data.pop('password1', '')
        password2 = serializer.validated_data.pop('password2', '')

        if password1:
            if password1 != password2:
                raise ValidationError({'password': 'Passwords are not the same.'})

            if len(password1) < 8:
                raise ValidationError({'password': 'Password should be at least 8 digits long.'})

            self.request.user.set_password(password1)

        user_info = serializer.validated_data['user']
        username = user_info.get('username', '')
        if not username:
            raise ValidationError({'username': 'Username must not be empty'})
        else:
            self.request.user.username = username

        email = user_info.get('email', '')
        if not email:
            raise ValidationError({'email': 'Email must not be empty'})
        else:
            self.request.user.email = email

        avatar = serializer.validated_data.pop('avatar', '')

        if avatar:
            self.request.user.seeker.avatar = avatar

        self.request.user.save()
        self.request.user.seeker.save()

class Shelters(CreateAPIView, RetrieveUpdateDestroyAPIView):
    serializer_class = ShelterSerializer

    def get_permissions(self):
        self.permission_classes = [IsAuthenticated]
        if self.request.method == 'POST':
            self.permission_classes = [AllowAny]
        return super().get_permissions()

    def get_object(self):
        if hasattr(self.request.user, 'shelter'):
            return self.request.user.shelter
        else:
            raise PermissionDenied

    def perform_create(self, serializer):
        # need to create a user
        if len(User.objects.filter(username=serializer.validated_data['user']['username'])) != 0:
            raise ValidationError({'username': 'Username already exists.'})

        password1 = serializer.validated_data.pop('password1', '')
        password2 = serializer.validated_data.pop('password2', '')

        if not password1 or not password2:
            raise ValidationError({'password': 'Missing password.'})

        if password1 != password2:
            raise ValidationError({'password': 'Passwords are not the same.'})

        if len(password1) < 8:
            raise ValidationError({'password': 'Password should be at least 8 digits long.'})

        serializer.validated_data['user']['password'] = password1

        user = User.objects.create_user(**serializer.validated_data['user'], account_type='shelter')
        serializer.save(user=user)

    def perform_update(self, serializer):
        if self.request.user.account_type != 'shelter':
            raise PermissionDenied

        if len(User.objects.filter(username=serializer.validated_data['user']['username']).exclude(\
                username=self.request.user.username)) != 0:
            raise ValidationError({'username': 'Username already exists.'})

        password1 = serializer.validated_data.pop('password1', '')
        password2 = serializer.validated_data.pop('password2', '')

        if password1:
            if password1 != password2:
                raise ValidationError({'password': 'Passwords are not the same.'})

            if len(password1) < 8:
                raise ValidationError({'password': 'Password should be at least 8 digits long.'})

            self.request.user.set_password(password1)

        user_info = serializer.validated_data['user']
        username = user_info.get('username', '')
        if not username:
            raise ValidationError({'username': 'Username must not be empty'})
        else:
            self.request.user.username = username

        email = user_info.get('email', '')
        if not email:
            raise ValidationError({'email': 'Email must not be empty'})
        else:
            self.request.user.email = email

        avatar = serializer.validated_data.pop('avatar', '')

        if avatar:
            self.request.user.shelter.avatar = avatar

        if (name := serializer.validated_data.pop('name', '')):
            self.request.user.shelter.name = name

        if (address := serializer.validated_data.pop('address', '')):
            self.request.user.shelter.address = address

        self.request.user.shelter.save()
        self.request.user.save()

class SheltersPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 10000

class SheltersList(ListAPIView):
    serializer_class = ShelterSerializer
    permission_classes=[AllowAny] # TODO: Remove this later
    pagination_class = SheltersPagination

    def get_queryset(self):
        return Shelter.objects.all()

class SheltersRetrieve(RetrieveAPIView):
    serializer_class = ShelterSerializer

    def get_object(self):
        return get_object_or_404(Shelter, user_id=self.kwargs['pk'])

class SeekersRetrieve(RetrieveAPIView):
    serializer_class = SeekerSerializer

    def get_object(self):
        if self.request.user.account_type != 'shelter':
            raise PermissionDenied('Only shelters can view specific seekers')

        seeker_user = get_object_or_404(Seeker, user_id = self.kwargs['pk'])
        print(seeker_user)

        if Application.objects.filter(user = seeker_user.user).filter(shelter=self.request.user):
            return seeker_user

        raise PermissionDenied('You need an application with this seeker')
