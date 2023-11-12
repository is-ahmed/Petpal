from rest_framework import serializers
from .models import Application

class ApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        #fields = ['pet_listing', 'status']
        fields = '__all__'

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

        # if instance and instance.status:
        #     current_status = instance.status
        #     status_choices = [(current_status, dict(status_choices).get(current_status))] + \
        #                      [choice for choice in status_choices if choice[0] != current_status]

        self.fields['status'] = serializers.ChoiceField(choices=status_choices)
    
    # def to_representation(self, instance):
    #     rep = super().to_representation(instance)

    #     current_status = instance.status
    #     all_choices = self.fields['status'].choices
    #     ordered_choices = [current_status] + [choice for choice in all_choices if choice != current_status]

    #     # Override the 'choices' of 'status' field to start with the current status
    #     self.fields['status'].choices = ordered_choices
    #     return rep

    def update(self, instance, validated_data):
        # Add logic to handle status updates based on user type (shelter or pet seeker)
        return super().update(instance, validated_data)
    
class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        #fields = ['id', 'pet_listing', 'user', 'status', 'creation_time', 'last_update_time']
        #read_only_fields = ['id', 'creation_time', 'last_update_time', 'status']
        fields = '__all__'
    
    def create(self, validated_data):
        # Add logic to ensure pet listing is available or maybe do in view?
        return super().create(validated_data)