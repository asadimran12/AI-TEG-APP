from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        
        # Generate username from email if not provided
        username = validated_data.get('username')
        if not username:
            username = validated_data['email'].split('@')[0]
            username = ''.join(c for c in username if c.isalnum() or c in '@.-_')
        validated_data['username'] = username

        user = User(**validated_data)
        user.set_password(password)
        user.role = 'user'
        user.save()
        return user
