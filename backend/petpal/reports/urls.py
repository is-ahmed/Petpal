from django.urls import path
from .views import ReportRetrieveUpdateDestroy, ReportListCreate

app_name="reports"
urlpatterns = [
    path("", ReportListCreate.as_view(), name="reports"),
    path("<int:pk>/", ReportRetrieveUpdateDestroy.as_view(), name="report")
]
