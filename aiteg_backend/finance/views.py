from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import AddStudentandFee, AddTeacherandPay,Assets,Expense,Investment
from .serializers import FeeSerializer,TeacherPaySerializer,AssestsSerializer,ExpenseSerializer,InvestmentSerializer
from django.db.models import Sum
from django.db.models import Count
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsAdminOrSuperAdmin


# Add student and fee payement class

class FeeViewSet(viewsets.ModelViewSet):
    queryset = AddStudentandFee.objects.all()
    serializer_class = FeeSerializer

    def destroy(self,request,pk=None):
        try:
            fee=AddStudentandFee.objects.get(pk=pk)
            fee.delete()
            return Response({"message": "Fee record deleted successfully"}, status=status.HTTP_200_OK)
        except AddStudentandFee.DoesNotExist:
            return Response({"error": "Fee record not found"}, status=status.HTTP_404_NOT_FOUND)

    def retrieve(self,request,pk=None):
        try:
            fee=AddStudentandFee.objects.get(pk=pk)
            serializer=FeeSerializer(fee)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except AddStudentandFee.DoesNotExist:
            return Response({"error": "Fee record not found"}, status=status.HTTP_404_NOT_FOUND)
        

    def update_status(self, request, pk=None):
        try:
            fee = AddStudentandFee.objects.get(pk=pk)
            fee.status = request.data.get("status", fee.status)
            fee.save()
            return Response({"message": "Fee status updated successfully"}, status=status.HTTP_200_OK)
        except AddStudentandFee.DoesNotExist:
            return Response({"error": "Fee record not found"}, status=status.HTTP_404_NOT_FOUND)
        

    @action(detail=False, methods=["GET"], url_path="overall-student-fee-calculation")
    def student_fee_calculation(self, request, pk=None):
        paid_total=AddStudentandFee.objects.filter(status="Paid").aggregate(total=Sum('amount'))['total'] or 0
        pending_total=AddStudentandFee.objects.filter(status="Pending").aggregate(total=Sum('amount'))['total'] or 0
        return Response({
            "total_paid_fees": paid_total,
            "total_pending_fees": pending_total
        }, status=status.HTTP_200_OK)




# Add reahcer and payemt class

class TeacherandPayview(viewsets.ModelViewSet):
    queryset = AddTeacherandPay.objects.all()
    serializer_class = TeacherPaySerializer

    def destroy(self, request, pk=None):
        try:
            record = AddTeacherandPay.objects.get(pk=pk)
            record.delete()
            return Response(
                {"message": "Payment record deleted successfully"},
               status=status.HTTP_200_OK
            )
        except AddTeacherandPay.DoesNotExist:
            return Response(
                {"error": "Payment record not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    def retrieve(self, request, pk=None):
        try:
            record = AddTeacherandPay.objects.get(pk=pk)
            serializer = self.get_serializer(record)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except AddTeacherandPay.DoesNotExist:
            return Response(
                {"error": "Teacher payment record not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=["patch"], url_path="update-status")
    def update_status(self, request, pk=None):
        """
        PATCH /api/finance/teacher-pays/<pk>/update-status/
        """
        try:
            record = self.get_object()
            record.pay_status = request.data.get("pay_status", record.pay_status)
            record.pay_date = request.data.get("pay_date", record.pay_date)
            record.save()

            serializer = self.get_serializer(record)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except AddTeacherandPay.DoesNotExist:
            return Response(
                {"error": "Payment record not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        
# Add Assests of compnay class

class Assestsview(viewsets.ModelViewSet):
    queryset = Assets.objects.all()
    serializer_class = AssestsSerializer


    def destroy(self, request, pk=None):
        try:
            record = Assets.objects.get(pk=pk)
            record.delete()
            return Response(
                {"message": "Assest record deleted successfully"},
               status=status.HTTP_200_OK
            )
        except Assets.DoesNotExist:
            return Response(
                {"error": "Assest record not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    def retrieve(self, request, pk=None):
        try:
            record = Assets.objects.get(pk=pk)
            serializer = self.get_serializer(record)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Assets.DoesNotExist:
            return Response(
                {"error": "Asset record not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
    @action(detail=True, methods=["patch"], url_path="update-status")
    def update_status(self, request, pk=None):
        """
        PATCH /api/finance/assests/<pk>/update-status/
        """
        try:
            record = self.get_object()
            record.payment_status = request.data.get("payment_status", record.payment_status)
            record.save()

            serializer = self.get_serializer(record)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Assets.DoesNotExist:
            return Response(
                {"error": "Assest record not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=["get"], url_path="summary")
    def summary(self, request):
        """
        GET /api/finance/assests/summary/
        Returns a list of main_category and count of unique sub_items
        """
        data = (
        Assets.objects.values("main_category")
        .annotate(
            sub_item_count=Count("sub_item", distinct=True),
            total_value=Sum("cost")
        )
    )
    
       # Optional: overall totals
        overall_total = Assets.objects.aggregate(total=Sum("cost"))["total"] or 0
        total_categories = data.count()

        return Response(
            {
                "categories": list(data),
                "overall_total": overall_total,
                "total_categories": total_categories
            },
            status=status.HTTP_200_OK
        )
    


class ExpenseView(viewsets.ModelViewSet):
    queryset=Expense.objects.all()
    serializer_class=ExpenseSerializer



    def destroy(self, request, pk=None):
        try:
            record = Expense.objects.get(pk=pk)
            record.delete()
            return Response(
                {"message": "Expense record deleted successfully"},
               status=status.HTTP_200_OK
            )
        except Expense.DoesNotExist:
            return Response(
                {"error": "Expense record not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    def retrieve(self, request, pk=None):
        try:
            record = Expense.objects.get(pk=pk)
            serializer = self.get_serializer(record)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Expense.DoesNotExist:
            return Response(
                {"error": "Expense record not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
    @action(detail=True, methods=["patch"], url_path="update-choices")
    def update_status(self, request, pk=None):
        """
        PATCH /api/finance/assests/<pk>/update-choices/
        """
        try:
            record = self.get_object()
            record.choices = request.data.get("choices", record.choices)
            record.save()

            serializer = self.get_serializer(record)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Assets.DoesNotExist:
            return Response(
                {"error": "Expense record not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=["get"], url_path="summary")
    def summary(self, request):
        """
        GET /api/finance/assests/summary/
        Returns a list of main_category and count of unique sub_items
        """
        data = (
        Expense.objects.values("category")
        .annotate(
            sub_item_count=Count("description", distinct=True),
            total_value=Sum("amount")
        )
    )
    
       # Optional: overall totals
        overall_total = Expense.objects.aggregate(total=Sum("amount"))["total"] or 0
        total_categories = data.count()

        return Response(
            {
                "categories": list(data),
                "overall_total": overall_total,
                "total_categories": total_categories
            },
            status=status.HTTP_200_OK
        )
    


class InvestmentViewSet(viewsets.ModelViewSet):
    queryset = Investment.objects.all()
    serializer_class = InvestmentSerializer
    permission_classes = [IsAuthenticated, IsAdminOrSuperAdmin]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        print(self.request.user)  # <-- prints the current logged-in user


    # DELETE / PATCH / GET single record
    def destroy(self, request, pk=None):
        try:
            record = Investment.objects.get(pk=pk)
            record.delete()
            return Response({"message": "Investment record deleted successfully"},
                            status=status.HTTP_200_OK)
        except Investment.DoesNotExist:
            return Response({"error": "Investment record not found"},
                            status=status.HTTP_404_NOT_FOUND)

    def retrieve(self, request, pk=None):
        try:
            record = Investment.objects.get(pk=pk)
            serializer = self.get_serializer(record)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Investment.DoesNotExist:
            return Response({"error": "Investment record not found"},
                            status=status.HTTP_404_NOT_FOUND)

    # PATCH / update a field (e.g., amount or description)
    @action(detail=True, methods=["patch"], url_path="update-fields")
    def update_fields(self, request, pk=None):
        try:
            record = self.get_object()
            record.item = request.data.get("item", record.item)
            record.amount = request.data.get("amount", record.amount)
            record.description = request.data.get("description", record.description)
            record.date = request.data.get("date", record.date)
            record.save()
            serializer = self.get_serializer(record)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Investment.DoesNotExist:
            return Response({"error": "Investment record not found"},
                            status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=["get"], url_path="summary")
    def summary(self, request):
            data = (
                Investment.objects.values("user__id", "user__username") 
                .annotate(
                    total_amount=Sum("amount"),
                    count=Count("id")
                )
            )

            overall_total = Investment.objects.aggregate(total=Sum("amount"))["total"] or 0
            total_items = data.count()

            return Response({
                "items": list(data),
                "overall_total": overall_total,
                "total_items": total_items
            }, status=status.HTTP_200_OK)