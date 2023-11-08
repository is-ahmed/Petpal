from .models import Pet
from .serializers import PetSerializer 
from django.shortcuts import get_object_or_404
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView 
from rest_framework import filters, permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from django.contrib.auth.mixins import UserPassesTestMixin
from rest_framework.pagination import PageNumberPagination
import json

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
        self.permission_classes = [IsShelter]
        if self.request.method == 'GET':
            self.permission_classes = []
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
        serializer.save()
    
    


class PetRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    serializer_class=PetSerializer
    queryset = Pet.objects.all()






