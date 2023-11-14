from django.urls import path

from .views import UserCommentCreate, ShelterCommentsListView, ApplicationCommentsListView, ShelterCommentsSortedListView, ApplicationCommentsSortedListView

urlpatterns = [ 
    path('commentcreation/<str:content_type>/<int:object_id>/', UserCommentCreate.as_view(), name='create_comment'),
    path('shelters/<int:shelter_id>/comments/', ShelterCommentsListView.as_view(), name='shelter_comments'),
    path('shelters/<int:shelter_id>/comments/sorted/', ShelterCommentsSortedListView.as_view(), name='shelter_comments_sorted'),
    path('applications/<int:application_id>/comments/', ApplicationCommentsListView.as_view(), name='application_comments'),
    path('applications/<int:application_id>/comments/sorted/', ApplicationCommentsSortedListView.as_view(), name='application_comments_sorted'),

]


