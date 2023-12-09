from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    #https://stackoverflow.com/questions/72139491/how-to-have-multiple-user-types-in-django
    account_type = models.TextField(choices=(('seeker', 'Seeker'), ('shelter', 'Shelter'), ('admin', 'Admin')))
    avatar = models.ImageField(upload_to='media/')

class Admin(models.Model):
    user = models.OneToOneField(User, primary_key=True, on_delete = models.CASCADE)

    def delete(self, *args, **kwargs):
        self.user.delete()
        return super().delete(*args, **kwargs)


class Seeker(models.Model):
    user = models.OneToOneField(User, primary_key=True, on_delete=models.CASCADE)

    def delete(self, *args, **kwargs):
        self.user.delete()
        return super().delete(*args, **kwargs)

class Shelter(models.Model):
    user = models.OneToOneField(User, primary_key=True, on_delete = models.CASCADE)
    name = models.TextField(max_length=200)
    address = models.TextField(max_length=200)
    phone_number = models.TextField(max_length=200)
    mission = models.TextField(max_length=800)

    def delete(self, *args, **kwargs):
        self.user.delete()
        return super().delete(*args, **kwargs)
