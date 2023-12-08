from rest_framework import serializers
from .models import Application

class ApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['pet_listing', 'user', 'shelter', 'adopterName', 'phoneNumber', 'postalCode', 'extraInfo'] 
        read_only_fields = ['pet_listing', 'user', 'shelter', 'adopterName', 'phoneNumber', 'postalCode', 'extraInfo']  

    def create(self, validated_data):
        # Add logic to ensure pet listing is available
        return super().create(validated_data)

class ApplicationUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['status']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        user = self.context['request'].user
        instance = self.context.get('instance', None)

        if user.account_type == 'shelter':  # Check if shetler
            status_choices = ['accepted', 'denied']
        elif user.account_type == 'seeker':  # Check if adopter
            status_choices = ['withdrawn']
        else:
            status_choices = []

        self.fields['status'] = serializers.ChoiceField(choices=status_choices)

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)
    
class ApplicationSerializer(serializers.ModelSerializer):
    pet_name = serializers.CharField(source='pet_listing.name', read_only=True)
    image = serializers.ImageField(source='pet_listing.image', read_only=True)
    class Meta:
        model = Application
        #fields = ['id', 'pet_listing', 'user', 'status', 'creation_time', 'last_update_time']
        #read_only_fields = ['id', 'creation_time', 'last_update_time', 'status']
        fields = '__all__'
    
    def create(self, validated_data):
        # Add logic to ensure pet listing is available or maybe do in view?
        return super().create(validated_data)
