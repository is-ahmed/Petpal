from django.shortcuts import render
from rest_framework import viewsets
from .models import Application
from .serializers import ApplicationCreateSerializer, ApplicationUpdateSerializer, ApplicationSerializer
from rest_framework.generics import CreateAPIView, UpdateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from petlistings.models import Pet
from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import RetrieveAPIView
from rest_framework.exceptions import ValidationError

class CustomPagination(PageNumberPagination):
    page_size = 2  # Set your desired page size here
    page_size_query_param = 'page_size'  # Allow client to override the page size using this query parameter
    max_page_size = 2  # Maximum limit for page size

class ApplicationView(RetrieveAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]


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
        return Application.objects.filter(user=user)

class ApplicationCreateAPIView(CreateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        #pet_listing = serializer.validated_data.get('pet_listing')
        pet_listing = self.kwargs.get('pet_id')
        # try:
        #     pet_listing = PetListing.objects.get(id=pet_id, status='available')
        # except PetListing.DoesNotExist:
        #     raise serializer.ValidationError({'message': 'Pet listing not available or does not exist.'})
        #shelter = pet_listing.shelter
        user=self.request.user
        serializer.save()

class ApplicationUpdateAPIView(UpdateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationUpdateSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        # Add logic to check if the user is a shelter or pet seeker to see what they can change
        # Also check for if this application is actually for the shelter in question
        # if isInstance(user, Adopter):
        #     raise serializer.ValidationError({'message': 'Do not have permission to update'})
        application = self.get_object()
        user = self.request.user
        if user.account_type == 'shelter':
            if application.status != 'pending' and application.status != 'accepted':
                raise ValidationError({'status': 'You can only modify applications that are pending or accepted.'})
        elif user.account_type =='seeker':
            if application.status != 'pending':
                raise ValidationError({'status': 'You can only modify applications that are pending or accepted.'})

        pet_listing = self.kwargs.get('pk')
        serializer.save()
