from django.urls import path
from .views import NotificationsListView, NotificationsRetrieveUpdateDestroyView

app_name="notifications"
urlpatterns=[
    path('notifs', NotificationsListView.as_view(), name="notifications"),
    path("notifs/<int:pk>", NotificationsRetrieveUpdateDestroyView.as_view(), name="notif")
]
