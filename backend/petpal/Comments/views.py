from django.shortcuts import get_object_or_404
from .serializer import CommentSerializer
from rest_framework.generics import CreateAPIView, ListCreateAPIView
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from django.contrib.contenttypes.models import ContentType
from rest_framework.pagination import PageNumberPagination
from .models import Comment
from auth_api.models import Shelter, AbstractUser
from applications.models import Application
from django.utils import timezone
from notifications.models import Notification
from django.db.models import Avg
from rest_framework.response import Response

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
            notification = Notification.objects.create(type="REVIEWS", read=False, creation_time=timezone.now(), for_user=shelter.user, link=f"http://localhost:3000/shelters/{shelter.user.id}")
            notification.save()

        elif content_type == 'application':
            if  user.account_type == "seeker":
                application = get_object_or_404(Application, pk=object_id, user=user)

                content_type_instance = ContentType.objects.get(model=content_type.lower())
                serializer.save(author=user, content_type=content_type_instance, object_id=object_id)
                application.last_update_time = timezone.now()
                application.save()
                notiUser = application.shelter
                notification = Notification.objects.create(type="COMMENT", read=False, creation_time=timezone.now(), for_user=notiUser.user, link=f"http://localhost:3000/application/{serializer.instance.id}")
                notification.save()
              
            elif user.account_type == "shelter":
                application = get_object_or_404(Application, pk=object_id, shelter=user)

                content_type_instance = ContentType.objects.get(model=content_type.lower())
                serializer.save(author=user, content_type=content_type_instance, object_id=object_id)
                application.last_update_time = timezone.now()
                application.save()
                notiUser = application.user
                notification = Notification.objects.create(type="COMMENT", read=False, creation_time=timezone.now(), for_user=notiUser, link=f"http://localhost:3000/application/{serializer.instance.id}")
                notification.save()
               

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
        return Comment.objects.filter(content_type=shelter_content_type, object_id=shelter_id)

    def list(self, request, *args, **kwargs):
        response = super().list(request, args, kwargs)
        comments = self.get_queryset()
        rating = comments.aggregate(Avg('rating', default=0))

        response.data['rating'] = rating['rating__avg']
        return response

class ShelterCommentsSortedListView(ShelterCommentsListView):
 
    
    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.order_by('-date_created')


class ApplicationCommentsListView(ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CommentPagination 

    def get_queryset(self):
        application_id = self.kwargs.get('application_id')
        application = get_object_or_404(Application, pk=application_id)

       
        user = self.request.user
        if user != application.user and user != application.shelter:
            raise PermissionDenied("You do not have permission to view these comments.")


        application_content_type = ContentType.objects.get(model='application')
        return Comment.objects.filter(content_type=application_content_type, object_id=application_id)

class ApplicationCommentsSortedListView(ApplicationCommentsListView):

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.order_by('-date_created')
