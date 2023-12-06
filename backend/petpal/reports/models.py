from django.db import models
from auth_api.models import User

# Create your models here.

class Report(models.Model):
    report_status = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('denied', 'Denied'),
        ('withdrawn', 'Withdrawn'),
    ]
    author = models.ForeignKey(User, on_delete = models.CASCADE,
                               related_name = 'author') #person who reported
    subject = models.ForeignKey(User, on_delete = models.SET_NULL,
                                related_name = 'subject', null=True)


    status = models.CharField(max_length=10, choices=report_status, default='pending')
    description = models.TextField(max_length=500)

    class Meta:
        constraints = [
                models.UniqueConstraint(
                    fields = ['author', 'subject'], name='author_subject'
                    )
                ]

