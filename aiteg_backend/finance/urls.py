from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FeeViewSet, TeacherandPayview,Assestsview,ExpenseView,InvestmentViewSet

router = DefaultRouter()
router.register(r'fees', FeeViewSet, basename='fee')
router.register(r'teacher-pays', TeacherandPayview, basename='teacherpay')
router.register(r'assests', Assestsview, basename='assests')
router.register(r'Expense', ExpenseView, basename='Expense')
router.register(r'investments', InvestmentViewSet, basename='investment')

urlpatterns = [
    path('', include(router.urls)),
]
