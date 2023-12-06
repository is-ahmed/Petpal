from django.shortcuts import render
from rest_framework import permissions
from rest_framework.generics import CreateAPIView, ListAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from .serializers import ReportSerializer
from .models import Report
from auth_api.models import User, Admin

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        admins = Admin.objects.all()
        for admin in admins:
            if admin.user == request.user:
                return True
        return False


# Create your views here.
class ReportRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    ...
    serializer_class = ReportSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        user = serializer.instance.subject
        if serializer.instance.status == 'accepted':
            user_instance = User.objects.get(pk=user.id)
            user_instance.delete()
        return super().perform_update(serializer)

class ReportListCreate(ListCreateAPIView):
    ...
    queryset = Report.objects.all()
    serializer_class = ReportSerializer

    def get_permissions(self):
        self.permission_classes = [IsAuthenticated]
        if self.request.method == 'GET':
            self.permission_classes = [IsAdmin]
        return super(ReportListCreate, self).get_permissions()


