from django.db import models
from auth_api.models import Shelter

# Create your models here.
class Pet(models.Model):
    name=models.CharField(max_length=120) # TODO: Double check this
    age=models.IntegerField()
    breed=models.CharField(max_length=120)
    species=models.CharField(max_length=120)
    gender=models.CharField(max_length=120)
    image=models.ImageField(upload_to="uploads", null=True)
    status=models.CharField(max_length=120, null=True)
    size=models.IntegerField(default=0)
    days_on_petpal=models.IntegerField(default=0)
    color=models.CharField(max_length=120, null=True)
    shelter=models.ForeignKey(Shelter, on_delete=models.SET_NULL, null=True) 
