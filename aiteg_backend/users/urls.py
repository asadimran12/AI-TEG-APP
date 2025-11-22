from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, Login,UserProfileView

router = DefaultRouter()
router.register(r'', UserViewSet, basename='users')  # /api/users/ for CRUD

urlpatterns = [
    path('login/', Login.as_view(), name='login'),  # /api/users/login/
     path("profile/", UserProfileView.as_view(), name="user-profile"),
]

# Include router URLs
urlpatterns += router.urls
