from django.shortcuts import render, get_object_or_404
from rest_framework.generics import CreateAPIView, RetrieveUpdateAPIView, RetrieveAPIView, \
    RetrieveUpdateDestroyAPIView, ListAPIView
from .seralizers import SeekerSerializer, ShelterSerializer
from .models import Seeker, Shelter, User
from rest_framework.permissions import AllowAny, IsAuthenticated

from rest_framework.exceptions import ValidationError, PermissionDenied

# Create your views here.

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
        user_info = serializer.validated_data.pop('user', {})

        if 'password' in user_info:
            self.request.user.set_password(user_info['password'])

        if 'username' in user_info:
            self.request.user.username = user_info['username']

        if 'email' in user_info:
            self.request.user.email = user_info['email']

        self.request.user.save()
        print(serializer.validated_data)
        serializer.save(user=self.request.user)

class SheltersList(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = ShelterSerializer

    def get_queryset(self):
        return Shelter.objects.all()

class SheltersRetrieve(RetrieveAPIView):
    serializer_class = ShelterSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        return get_object_or_404(Shelter, user_id=self.kwargs['pk'])

