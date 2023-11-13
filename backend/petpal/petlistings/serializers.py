from rest_framework.serializers import ModelSerializer
from .models import Pet
class PetSerializer(ModelSerializer):
    ...
    class Meta:
        model = Pet
        fields = '__all__'
