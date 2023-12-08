from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import Seekers, Shelters, SheltersRetrieve, SheltersList, SeekersRetrieve, Admins

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), #not used
    path('seeker/', Seekers.as_view(), name='seeker'),
    path('admins/', Admins.as_view(), name='admin'),
    path('seeker/<int:pk>', SeekersRetrieve.as_view(), name='seeker-retrieve'),
    path('shelter/', Shelters.as_view(), name='shelter'),
    path('shelter/<int:pk>/', SheltersRetrieve.as_view(), name='shelter-retrieve'),
    path('shelters/', SheltersList.as_view(), name='shelters-list'),
]
