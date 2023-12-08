from rest_framework.serializers import ModelSerializer, DateTimeField, \
    PrimaryKeyRelatedField
from .models import Comment


class CommentSerializer(ModelSerializer):
    author = PrimaryKeyRelatedField(source='author.username', read_only=True)
    date_created = DateTimeField(read_only=True)

    class Meta:
        model = Comment
        fields = ['text', 'author', 'date_created', 'rating']
