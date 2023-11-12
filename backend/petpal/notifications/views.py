from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView 
from .models import Notification
from .serializers import NotifSerializer
from rest_framework.pagination import PageNumberPagination
from django_filters import FilterSet
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from rest_framework import permissions
# Create your views here.

class NotifSearchPagination(PageNumberPagination):
    page_size=2
    page_size_query_param = 'page_size'
    max_page_size=12
    page_query_param = 'p'


class NotifFilter(FilterSet):
    ...
    class Meta:
        model=Notification
        fields=['read']

class NotificationsListView(ListAPIView):
    ...
    queryset=Notification.objects.all()
    serializer_class=NotifSerializer
    pagination_class=NotifSearchPagination
    ordering_fields=['creation_time']
    ordering=['creation_time'];
    filter_backends=[DjangoFilterBackend, OrderingFilter]
    filterset_class=NotifFilter

    def get_queryset(self):
        queryset = Notification.objects.filter(user=self.request.user)
        return queryset


class NotificationsRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset=Notification.objects.all()
    permission_classes=[permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        notification = get_object_or_404(Notification, pk=self.kwargs['pk'])
        if self.request.user != notification.user:
            raise PermissionDenied("You do not have permission to view this notification")
        notification.read = True
        notification.save()
        return {
                "link": notification.link
        }

    def perform_update(self, serializer):
        if self.request.user == serializer.instance.user:
            serializer.save()
        else:
            raise PermissionDenied("You do not have permission to update this notication")

    def perform_destroy(self, instance):
        if self.request.user == instance.user:
            instance.delete()
        else:
            raise PermissionDenied("You do not have permission to delete this notification")
