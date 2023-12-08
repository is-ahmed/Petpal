from .models import Report
from rest_framework import serializers
from rest_framework.serializers import CharField, ReadOnlyField

class ReportSerializer(serializers.ModelSerializer):
    id = ReadOnlyField()
    name = CharField(source = 'subject.username', read_only=True)
    class Meta:
        model = Report
        fields = ['id', 'subject', 'status', 'description', 'name']
        read_only_fields = ['author']
