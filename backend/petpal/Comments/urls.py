from django.urls import path

from .views import UserCommentCreate, ShelterCommentsListView, ApplicationCommentsListView

urlpatterns = [ 
    path('commentcreation/<str:content_type>/<int:object_id>/', UserCommentCreate.as_view(), name='create_comment'),
    path('shelters/<int:shelter_id>/comments/', ShelterCommentsListView.as_view(), name='shelter_comments'),
    path('applications/<int:application_id>/comments/', ApplicationCommentsListView.as_view(), name='application_comments'),
]


