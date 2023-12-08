from .models import Report
from rest_framework import serializers
from rest_framework.serializers import CharField, ReadOnlyField

class ReportSerializer(serializers.ModelSerializer):
    id = ReadOnlyField()
    class Meta:
        model = Report
        fields = ['id', 'subject', 'status', 'description']
        read_only_fields = ['author']
