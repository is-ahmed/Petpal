from django.shortcuts import render
from rest_framework import permissions
from rest_framework.generics import CreateAPIView, ListAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
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
    permission_classes = [IsAdmin]
    queryset = Report.objects.all()

    def perform_update(self, serializer):
        user = serializer.instance.subject
        if self.request.data['status'] == 'accepted':
            user_instance = User.objects.get(pk=user.id)
            user_instance.delete()
            serializer.instance.delete()
            return Response({"detail": "User deleted successfully."}, status=200)
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

    def perform_create(self, serializer):
        reports = Report.objects.filter(author=self.request.user)
        for report in reports:
            if report.subject == serializer.validated_data['subject']:
                return Response({"detail": "Not allowed to make another report"})
        serializer.save(author=self.request.user)


