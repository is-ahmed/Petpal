from .models import Pet
from .serializers import PetSerializer 
from django.shortcuts import get_object_or_404
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView 


# Basing this off of slide 6 lecture 10
class PetsListCreate(ListCreateAPIView):
    queryset=Pet.objects.all()
    serializer_class = PetSerializer


class PetRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    ...
    serializer_class=PetSerializer
    queryset = Pet.objects.all()

    def delete(self, request, *args, **kwargs):
        # TODO: Delete all applications and their comments when deleting a pet, need 
        return super().delete(request, *args, **kwargs)



