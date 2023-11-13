from django.urls import path
from .views import PetsListCreate, PetRetrieveUpdateDestroy
from applications.views import ApplicationCreateAPIView

app_name="petlistings"
urlpatterns = [
    path("pets", PetsListCreate.as_view(), name="petlist"),
    path("pets/<int:pk>", PetRetrieveUpdateDestroy.as_view(), name="pet"),
    path("pets/<int:pet_id>/applications/", ApplicationCreateAPIView.as_view(), name="application-create"),
]
