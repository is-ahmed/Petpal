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
from auth_api.models import Seeker, Shelter

from django_filters import FilterSet, CharFilter, NumberFilter

class PetFilter(FilterSet):
    class Meta:
        model = Pet
        fields = ['status', 'species', 'shelter', 'gender', 'breed', 'days_on_petpal']
    status = CharFilter(method='status_filter')
    shelter = NumberFilter(method='shelter_filter')

    def status_filter(self, queryset, name, value):
        if value == 'all':
            return queryset
        return queryset.filter(**{name: value})

    def shelter_filter(self, queryset, name, value):
        if value == -1:
            return queryset
        return queryset.filter(**{name: value})



class PetSearchPagination(PageNumberPagination):
    page_size=10
    page_size_query_param = 'page_size'
    max_page_size=12
    page_query_param = 'p'



class IsShelter(permissions.BasePermission):
    def has_permission(self, request, view): 
        # Could improve this code probably
        shelters = Shelter.objects.all()
        for shelter in shelters:
            if shelter.user == request.user:
                return True 
        return False

    

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
        self.permission_classes = [IsShelter]
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
        seekers = Seeker.objects.all()
        serializer.save()
        serializer.instance.shelter = self.request.user.shelter
        serializer.save()
        for seeker in seekers:
            notification = Notification.objects.create(type="NEW_PET_LISTING", read=False, creation_time=datetime.now(), for_user=seeker.user, link=f"http://localhost:3000/pet/{serializer.instance.id}")
            notification.save()
    
    


class PetRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    serializer_class=PetSerializer
    queryset = Pet.objects.all()
    
    def get_permissions(self):
        self.permission_classes = [IsShelter]
        if self.request.method == 'GET':
            self.permission_classes = [permissions.IsAuthenticated]
        return super(PetRetrieveUpdateDestroy, self).get_permissions()
    # Need to only allow shelters to update or delete their pets
    def perform_update(self, serializer):
        if self.request.user == serializer.instance.shelter.user:
            serializer.save()
        else:
            raise PermissionDenied("You do not have permission to update this pet")

    def perform_destroy(self, instance):
        if self.request.user == instance.shelter.user:
            instance.delete()
        else:
            raise PermissionDenied("You do not have permission to delete this pet")






