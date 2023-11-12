from django.db import models
from django.utils import timezone
from petlistings.models import Pet
from django.contrib.auth.models import User

# Create your models here.

class Application(models.Model):
    applicationStatus = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('denied', 'Denied'),
        ('withdrawn', 'Withdrawn'),
    ]
    #pet_listing = models.ForeignKey(Pet, on_delete=models.CASCADE)
    pet_listing = models.IntegerField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications') #AdopterUser
    #shelter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications') #ShelterUser
    status = models.CharField(max_length=10, choices=applicationStatus, default='pending')
    creation_time = models.DateTimeField(auto_now_add=True)
    last_update_time = models.DateTimeField(auto_now=True)

    # def __str__(self):
    #     return f'Application for {self.pet_listing}'