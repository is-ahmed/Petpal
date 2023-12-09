from django.db import models
from django.utils import timezone
from petlistings.models import Pet
from django.contrib.auth.models import User
from petpal_backend import settings
from auth_api.models import Shelter

# Create your models here.

class Application(models.Model):
    applicationStatus = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('denied', 'Denied'),
        ('withdrawn', 'Withdrawn'),
    ]
    pet_listing = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name='pet_applications')
    #pet_listing = models.IntegerField()
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user_applications') #AdopterUser
    shelter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='shelter_applications') #ShelterUser
    status = models.CharField(max_length=10, choices=applicationStatus, default='pending')
    adopterName = models.CharField(max_length=255, default='')
    phoneNumber = models.CharField(max_length=20, blank=True, null=True, default='')
    postalCode = models.CharField(max_length=10, blank=True, null=True, default='')
    extraInfo = models.CharField(max_length=500, blank=True, null=True, default='')
    creation_time = models.DateTimeField(auto_now_add=True)
    last_update_time = models.DateTimeField(auto_now=True)

    pet_name = models.CharField(max_length = 200);
    pet_image = models.ImageField()

    # def __str__(self):
    #     return f'Application for {self.pet_listing}'
