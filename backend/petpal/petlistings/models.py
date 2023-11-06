from django.db import models

# Create your models here.
class Pet(models.Model):
    name=models.CharField(max_length=120) # TODO: Double check this
    age=models.IntegerField()
    breed=models.CharField(max_length=120)
    species=models.CharField(max_length=120)
    gender=models.CharField(max_length=120)
    image=models.ImageField(upload_to="uploads", null=True)
    available=models.BooleanField(max_length=120)
    #shelter=models.ForeignKey(Shelter, on_delete=models.SET_NULL, null=True)  # Need Jeff to finish his stuff for this
