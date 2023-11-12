from django.db import models
from django.contrib.auth.models import User

TYPE_CHOICES = (
    ("CONVERSATION", "conversation"),
    ("APPLICATION_STATUS", "application status update"),
    ("COMMENT", "new comments"),
    ("REVIEWS", "new reviews"),
    ("NEW_PET_LISTING", "new pet added")
)

# Create your models here.
class Notification(models.Model):
    ...
    type=models.TextField(choices=TYPE_CHOICES)
    read=models.BooleanField(default=False)
    creation_time=models.DateTimeField(auto_now_add=True)
    for_user=models.ForeignKey(User, on_delete=models.CASCADE);
    link=models.CharField(max_length=200)
