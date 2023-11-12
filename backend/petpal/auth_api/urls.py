from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import Seekers, Shelters, SheltersRetrieve

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), #not used
    path('seeker/', Seekers.as_view(), name='seeker'),
    path('shelter/', Shelters.as_view(), name='shelter'),
    path('shelter/<int:pk>/', SheltersRetrieve.as_view(), name='shelter-retrieve'),
]