from django.urls import path
from .views import PetsListCreate, PetRetrieveUpdateDestroy

app_name="petlistings"
urlpatterns = [
    path("api/pets", PetsListCreate.as_view(), name="petlist"),
    path("api/pets/<int:pk>", PetRetrieveUpdateDestroy.as_view(), name="pet")
]
