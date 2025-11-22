from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .serializers import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print(serializer.errors)  # <-- debug errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class Login(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        user = authenticate(request, username=email, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            print(refresh)
            return Response({
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": getattr(user, "role", "User"),
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            })
        
        
        
        return Response({"error": "Invalid credentials"}, status=400)


class UserProfileView(APIView):

    def get(self, request):
        user = request.user

        # Optional: Add academy info dynamically
        academy_info = {
            "institute": "Ai-Teg Academy",
            "launched": "2025",
            "active_modules": 4,
            "location": "Shalimar Town Pahlia, Punjab, Pakistan"
        }

        data = {
            "username": user.username,
            "email": user.email,
            "role": getattr(user, "role", "User"),
            **academy_info
        }

        return Response(data, status=200)
