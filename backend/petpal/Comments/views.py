from django.shortcuts import get_object_or_404
from serializer import CommentSerializer
from rest_framework.generics import CreateAPIView, ListCreateAPIView
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from django.contrib.contenttypes.models import ContentType
from rest_framework.pagination import PageNumberPagination
from models import Comment
from auth_api.models import Shelter, AbstractUser
from applications.models import Application

# Create your views here.
class CommentPagination(PageNumberPagination):
    page_size = 10  
    page_query_param = 'page'
    page_size_query_param = 'page_size'
    max_page_size = 50

class UserCommentCreate(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CommentSerializer

    def perform_create(self, serializer):
        user = self.request.user
        object_id = self.kwargs.get('object_id')
        content_type = self.kwargs.get('content_type')

        if content_type == 'shelter':
            shelter = get_object_or_404(Shelter, pk=object_id)
            content_type_instance = ContentType.objects.get(model=content_type.lower())
            serializer.save(author=user, content_type=content_type_instance, object_id=object_id)

        elif content_type == 'adoptionapplication':
            application = get_object_or_404(Application, pk=object_id)

            if user.account_type == "shelter" or user.account_type == "seeker":
                content_type_instance = ContentType.objects.get(model=content_type.lower())
                serializer.save(author=user, content_type=content_type_instance, object_id=object_id)
            else:
                raise PermissionDenied("You do not have permission to comment on this application.")

class ShelterCommentsListView(ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CommentPagination 

    def get_queryset(self):
        shelter_id = self.kwargs.get('shelter_id')

       
        get_object_or_404(Shelter, pk=shelter_id)

        shelter_content_type = ContentType.objects.get(model='shelter')
        return Comment.objects.filter(content_type=shelter_content_type, object_id=shelter_id).order_by('-date_created')
    

class ApplicationCommentsListView(ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CommentPagination 

    def get_queryset(self):
        application_id = self.kwargs.get('application_id')
        application = get_object_or_404(Application, pk=application_id)

       
        user = self.request.user
        if user != application.user:
            raise PermissionDenied("You do not have permission to view these comments.")

        application_content_type = ContentType.objects.get(model='adoptionapplication')
        return Comment.objects.filter(content_type=application_content_type, object_id=application_id).order_by('-date_created')
    
