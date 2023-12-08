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
from rest_framework.exceptions import ValidationError, PermissionDenied
from notifications.models import Notification
from datetime import datetime

class CustomPagination(PageNumberPagination):
    page_size = 10  
    page_size_query_param = 'page_size'  
    max_page_size = 12  

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
    pagination_class = CustomPagination

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
        user = self.request.user
        if user.account_type == 'shelter':
            raise PermissionDenied({'message': 'Shelters cannot apply to adopt pets.'})
        pet_id = self.kwargs.get('pet_id')
        try:
            #print("Works")
            pet_listing = Pet.objects.get(id=pet_id, status='available')
        except Pet.DoesNotExist:
            #print("No pet")
            raise PermissionDenied({'message': 'Pet listing not available or does not exist.'})
        
        try:
            applicationExists = Application.objects.get(pet_listing=pet_listing, user=user)
            raise PermissionDenied({'message': 'You already have an application for this pet.'})
        except Application.DoesNotExist:
            pass

        #serializer.save(user=self.request.user, pet_listing=pet_listing, shelter=pet_listing.shelter.user)
        serializer.save(
            user=self.request.user,
            pet_listing=pet_listing,
            shelter=pet_listing.shelter.user,
            adopterName=self.request.data.get('adopterName'),
            phoneNumber=self.request.data.get('phoneNumber'),
            postalCode=self.request.data.get('postalCode'),
            extraInfo=self.request.data.get('extraInfo')
        )

        notification = Notification.objects.create(type="NEW_APPLICATION", read=False, creation_time=datetime.now(), for_user=serializer.instance.shelter, link=f"http://localhost:3000/application/{serializer.instance.id}")
        notification.save()

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

    # def get_object(self):
    #     application = super().get_object()  # Get the object using the default implementation
    #     user = self.request.user

    def get_object(self):
        # Retrieve the object using the default implementation
        obj = super().get_object()

        user = self.request.user

        # Check permissions based on user account type
        if user.account_type == 'seeker' and user != obj.user:
            raise PermissionDenied("Seekers can only access their own applications.")
        elif user.account_type == 'shelter' and user != obj.shelter:
            raise PermissionDenied("Shelters can only access applications related to them.")

        return obj
    
    def get_queryset(self):
        return Application.objects.all()
        # user = self.request.user
        
        # if user.account_type == 'seeker':
        #     return Application.objects.filter(user=user)
        # elif user.account_type == 'shelter':
        #     return Application.objects.filter(shelter=user)
        # return Application.objects.none()  #If not logged in just return nothing

    def perform_update(self, serializer):
        application = self.get_object()
        user = self.request.user


        # if not (user == application.user or user == application.shelter):
        #     raise PermissionDenied({'message':"You do not have permission to update this application."})
        
        orig_status = application.status
        if user.account_type == 'shelter':
            if application.status != 'pending':
                raise PermissionDenied({'You can only modify applications that are pending.'})
        elif user.account_type == 'seeker':
            if not (application.status == 'pending' or application.status == 'accepted'):
                raise PermissionDenied({'You can only modify applications that are pending or accepted.'})
        
        serializer.save()
        updated_status = serializer.instance.status
        if updated_status != orig_status:
            if user.account_type == 'shelter':
                notiUser = serializer.instance.user
            elif user.account_type == 'seeker':
                notiUser = serializer.instance.shelter
            notification = Notification.objects.create(type="APPLICATION_STATUS", read=False, creation_time=datetime.now(), for_user=notiUser, link=f"http://localhost:3000/application/{serializer.instance.id}")
            notification.save()
