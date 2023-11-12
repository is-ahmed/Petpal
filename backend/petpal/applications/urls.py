from django.urls import path
from .views import ApplicationCreateAPIView, ApplicationUpdateAPIView, ApplicationListView, ApplicationView

app_name="applications"
urlpatterns = [
    path("", ApplicationListView.as_view(), name="application-list"),
    path("<int:pk>/", ApplicationView.as_view(), name="application"),
    path("create/<int:pet_id>/", ApplicationCreateAPIView.as_view(), name="create"),
    path("update/<int:pk>/", ApplicationUpdateAPIView.as_view(), name="update"),
]
