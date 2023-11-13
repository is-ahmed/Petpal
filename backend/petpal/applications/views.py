from django.shortcuts import render
from rest_framework import viewsets
from .models import Application
from .serializers import ApplicationCreateSerializer, ApplicationUpdateSerializer, ApplicationSerializer
from rest_framework.generics import CreateAPIView, UpdateAPIView, ListAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from petlistings.models import Pet
from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import RetrieveAPIView
from rest_framework.exceptions import ValidationError
from notifications.models import Notification
from datetime import datetime

class CustomPagination(PageNumberPagination):
    page_size = 2  # Set your desired page size here
    page_size_query_param = 'page_size'  # Allow client to override the page size using this query parameter
    max_page_size = 2  # Maximum limit for page size

class ApplicationView(RetrieveAPIView):
    #queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.account_type == 'seeker':
            qset = Application.objects.filter(user=user)
        elif user.account_type == 'shelter':
            qset = Application.objects.filter(shelter=user)
        else:
            qset = []
        return qset

class ApplicationListView(ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['status']
    ordering_fields = ['creation_time', 'last_update_time']
    pagination_class = PageNumberPagination

    def get_queryset(self):
        # Assuming 'user' is a ForeignKey to the Shelter in the Application model
        user = self.request.user
        if user.account_type == 'seeker':
            qset = Application.objects.filter(user=user)
        elif user.account_type == 'shelter':
            qset = Application.objects.filter(shelter=user)
        else:
            qset = []
        return qset

class ApplicationCreateAPIView(CreateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        #pet_listing = serializer.validated_data.get('pet_listing')
        pet_id = self.kwargs.get('pet_id')
        try:
            #print("Works")
            pet_listing = Pet.objects.get(id=pet_id, status='available')
        except Pet.DoesNotExist:
            #print("No pet")
            raise ValidationError({'message': 'Pet listing not available or does not exist.'})
        serializer.save(user=self.request.user, pet_listing=pet_listing, shelter=pet_listing.shelter.user)

class ApplicationUpdateAPIView(UpdateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationUpdateSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        application = self.get_object()
        user = self.request.user
        if user.account_type == 'shelter':
            if application.status != 'pending':
                raise ValidationError({'status': 'You can only modify applications that are pending.'})
        elif user.account_type =='seeker':
            if not (application.status == 'pending' or application.status == 'accepted'):
                raise ValidationError({'status': 'You can only modify applications that are pending or accepted.'})

        #pet_listing = self.kwargs.get('pk')
        serializer.save()

class ApplicationRetrieveUpdateView(RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ApplicationUpdateSerializer
        return ApplicationSerializer

    def get_queryset(self):
        user = self.request.user
        if user.account_type == 'seeker':
            return Application.objects.filter(user=user)
        elif user.account_type == 'shelter':
            return Application.objects.filter(shelter=user)
        return Application.objects.none()  #If not logged in just return nothing

    def perform_update(self, serializer):
        application = self.get_object()
        user = self.request.user

        # if application.user != user and application.shelter != user.shelter:
        #     raise ValidationError({'message':"You do not have permission to update this application."})
        
        orig_status = application.status
        if user.account_type == 'shelter':
            if application.status != 'pending':
                raise ValidationError({'status': 'You can only modify applications that are pending.'})
        elif user.account_type == 'seeker':
            if not (application.status == 'pending' or application.status == 'accepted'):
                raise ValidationError({'status': 'You can only modify applications that are pending or accepted.'})
        
        serializer.save()
        updated_status = serializer.instance.status
        if updated_status != orig_status:
            if user.account_type == 'shelter':
                notiUser = serializer.instance.user
            elif user.account_type == 'seeker':
                notiUser = serializer.instance.shelter
            notification = Notification.objects.create(type="APPLICATION_STATUS", read=False, creation_time=datetime.now(), for_user=notiUser, link=f"http://localhost:8000/applications/{serializer.instance.id}")
            notification.save()
