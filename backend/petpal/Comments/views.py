from django.shortcuts import get_object_or_404
from serializer import CommentSerializer
from rest_framework.generics import CreateAPIView, ListCreateAPIView
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from django.contrib.contenttypes.models import ContentType
from models import Comment

# Create your views here.

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
            application = get_object_or_404(AdoptionApplication, pk=object_id)

            if user == application.shelter.user or user == application.pet_seeker.user:
                content_type_instance = ContentType.objects.get(model=content_type.lower())
                serializer.save(author=user, content_type=content_type_instance, object_id=object_id)
            else:
                raise PermissionDenied("You do not have permission to comment on this application.")

class ShelterCommentsListView(ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        shelter_id = self.kwargs.get('shelter_id')

        # Check if the shelter exists; if not, this will raise an HTTP 404 error
        get_object_or_404(Shelter, pk=shelter_id)

        shelter_content_type = ContentType.objects.get(model='shelter')
        return Comment.objects.filter(content_type=shelter_content_type, object_id=shelter_id).order_by('-date_created')
    

class ApplicationCommentsListView(ListAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        application_id = self.kwargs.get('application_id')
        application = get_object_or_404(AdoptionApplication, pk=application_id)

        # Check permissions
        user = self.request.user
        if user != application.shelter and user != application.pet_seeker:
            raise PermissionDenied("You do not have permission to view these comments.")

        application_content_type = ContentType.objects.get(model='adoptionapplication')
        return Comment.objects.filter(content_type=application_content_type, object_id=application_id).order_by('-date_created')