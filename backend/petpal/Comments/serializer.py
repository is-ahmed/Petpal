from rest_framework.serializers import ModelSerializer, DateTimeField, \
    PrimaryKeyRelatedField
from .models import Comment


class CommentSerializer(ModelSerializer):
    author = PrimaryKeyRelatedField(read_only=True)
    date_created = DateTimeField(read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'