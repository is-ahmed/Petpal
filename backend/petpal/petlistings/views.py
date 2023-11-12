from django.core.exceptions import PermissionDenied
from .models import Pet
from .serializers import PetSerializer 
from django.shortcuts import get_object_or_404
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView 
from rest_framework import filters, permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from django.contrib.auth.mixins import UserPassesTestMixin
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth.models import User
from notifications.models import Notification
from datetime import datetime

from django_filters import FilterSet, CharFilter

class PetFilter(FilterSet):
    class Meta:
        model = Pet
        fields = ['status', 'age', 'species'] # TODO: Add shelter
    status = CharFilter(method='status_filter')

    def status_filter(self, queryset, name, value):
        if value == 'all':
            return queryset
        return queryset.filter(**{name: value})



class PetSearchPagination(PageNumberPagination):
    page_size=2
    page_size_query_param = 'page_size'
    max_page_size=12
    page_query_param = 'p'



class IsShelter(permissions.BasePermission):
    def has_permission(self, request, view): 
        # TODO: Implement this when Seeker and Shelter models are finalized
        return super().has_permission(request, view) 

    

# Basing this off of slide 6 lecture 10

# Only shelters should be able to create new pets, but both seekers and shelters should be able to view
class PetsListCreate(ListCreateAPIView):
    queryset=Pet.objects.all()
    serializer_class = PetSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = PetFilter
    ordering_fields = ['name', 'age']
    ordering=['name'] # Default ordering
    pagination_class = PetSearchPagination 

    def get_permissions(self):
        self.permission_classes = [permissions.IsAuthenticated] # TODO: Change to IsShelter later
        if self.request.method == 'GET':
            self.permission_classes = [permissions.IsAuthenticated]
        return super(PetsListCreate, self).get_permissions()

    def get_queryset(self):
        status = self.request.GET.get('status', '')

        if status == '':
            status = 'available'
        queryset = Pet.objects.filter(status=status)
        if status == 'all':
            return Pet.objects.all()
        return queryset

    def perform_create(self, serializer):
        # TODO: Save the pet to the shelter?
        # serializer.instance.shelter = self.request.user
        users = User.objects.all()
        for user in users:
            notification = Notification.objects.create(type="NEW_PET_LISTING", read=False, creation_time=datetime.now(), for_user=user, link=f"http://localhost:8000/petlistings/pets/{serializer.instance.id}")
            notification.save()
        serializer.save()
    
    


class PetRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    serializer_class=PetSerializer
    queryset = Pet.objects.all()
    permission_classes=[permissions.IsAuthenticated]

    # Need to only allow shelters to update or delete their pets
    def perform_update(self, serializer):
        if self.request.user == serializer.instance.user:
            serializer.save()
        else:
            raise PermissionDenied("You do not have permission to update this pet")

    def perform_destroy(self, instance):
        if self.request.user == instance.shelter:
            instance.delete()
        else:
            raise PermissionDenied("You do not have permission to delete this pet")






