from rest_framework.serializers import ModelSerializer
from .models import Notification
class NotifSerializer(ModelSerializer):
    ...
    class Meta:
        model = Notification 
        fields = '__all__' # TODO: Double check if this does what I think it does
    def update(self, instance, validated_data):
        if validated_data.get('read', True) == True:
            instance.read = True
            instance.save()
        return instance
