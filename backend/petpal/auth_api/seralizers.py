from rest_framework.serializers import ModelSerializer, DateTimeField, ListField, \
    PrimaryKeyRelatedField, HyperlinkedRelatedField, CharField, ImageField, EmailField, IntegerField

from .models import Seeker, Shelter, User, Admin

class AdminSerializer(ModelSerializer):
    username = CharField(source='user.username')
    # password = CharField(write_only=True, source='user.password')
    email = EmailField(source='user.email')
    password1 = CharField(write_only=True)
    password2 = CharField(write_only=True)

    class Meta:
        model = Admin 
        fields = ['username', 'email', 'password1', 'password2']

class SeekerSerializer(ModelSerializer):
    username = CharField(source='user.username')
    # password = CharField(write_only=True, source='user.password')
    email = EmailField(source='user.email')
    password1 = CharField(write_only=True)
    password2 = CharField(write_only=True)
    avatar = ImageField(source='user.avatar')

    class Meta:
        model = Seeker
        fields = ['username', 'email', 'password1', 'password2', 'avatar']

class ShelterSerializer(ModelSerializer):
    username = CharField(source='user.username')
    # password = CharField(write_only=True, source='user.password')
    email = EmailField(source='user.email')
    password1 = CharField(write_only=True)
    password2 = CharField(write_only=True)
    avatar = ImageField(source='user.avatar')
    shelter_id = IntegerField(source='user.id', read_only=True)

    class Meta:
        model = Shelter
        fields = ['name', 'address', 'email', 'username', 'password1', 'password2', 'avatar', 'shelter_id', 'mission', 'phone_number']

