from rest_framework import serializers
from .models import AddStudentandFee, AddTeacherandPay,Assets,Expense,Investment


class FeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AddStudentandFee
        fields = '__all__'

class TeacherPaySerializer(serializers.ModelSerializer):
    class Meta:
        model = AddTeacherandPay
        fields = '__all__'

class AssestsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assets
        fields = '__all__'

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model=Expense
        fields='__all__'

class InvestmentSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()  # <-- add this

    class Meta:
        model = Investment
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at')

    def get_user(self, obj):
        if obj.user:
            return {
                "id": obj.user.id,
                "username": obj.user.username,
                "role": obj.user.role,  
            }
        return None