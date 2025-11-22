from django.db import models
from datetime import date
from decimal import Decimal
from django.utils import timezone
from django.contrib.auth import get_user_model

# --- CHOICES CONFIGURATION ---

# General Status
STATUS_CHOICES = (
    ("Paid", "Paid"),
    ("Pending", "Pending")
)

INVESTMENT_TYPES = [
        ("Bank", "Bank Savings"),
        ("Crypto", "Crypto Holding"),
        ("Bonds", "Bonds / Government"),
        ("Private", "Private Investor Funds"),
        ("Stocks", "Stocks / Mutual Funds"),
        ("RealEstate", "Real Estate"),
    ]

# Detailed Payment Status (includes Partial)
PAYMENT_STATUS_CHOICES = [
    ("Paid", "Paid"),
    ("Partial", "Partial"),
    ("Pending", "Pending"),
]

COURSES_CHOICES = (
    ("Programming", "Programming"),
    ("Robotics", "Robotics"),
    ("AI", "AI"),
    ("Training", "Training"),
)

# Categories specifically for Daily Expenses
EXPENSE_CATEGORIES = [
    ("Utilities", "Electricity / Utilities"),
    ("Refreshments", "Snacks / Tea"),
    ("Stationery", "Notes / Printing"),
    ("Maintenance", "Repairs / Maintenance"),
    ("Miscellaneous", "Miscellaneous"),
]

# Categories specifically for Fixed Assets
ASSET_CATEGORIES = [
    ("Furniture", "Furniture"),
    ("Lab Equipment", "Lab Equipment"),
    ("Electronics", "Electronics"),
    ("Stationery", "Stationery"),
]


# --- MODELS ---

class AddTeacherandPay(models.Model):
    teacher_name = models.CharField(max_length=100)
    course = models.CharField(max_length=100, choices=COURSES_CHOICES, default="Robotics")
    Contactnumber = models.CharField(max_length=15, blank=True, null=True)
    pay_date = models.DateField(default=date.today) 
    pay_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment to {self.teacher_name} - Date: {self.pay_date.strftime('%Y-%m-%d')}"


class AddStudentandFee(models.Model):
    student_name = models.CharField(max_length=100)
    father_name = models.CharField(max_length=100, blank=True, null=True) 
    course = models.CharField(max_length=100, choices=COURSES_CHOICES, default="Robotics")
    due_date = models.DateField(default=date.today) 
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True) 

    def __str__(self):
        return f"Fee for {self.student_name} - Due: {self.due_date.strftime('%Y-%m')}"


class Assets(models.Model):  
    main_category = models.CharField(max_length=50, choices=ASSET_CATEGORIES, default="Furniture", help_text="Select main category")
    sub_item = models.CharField(max_length=100, help_text="Specify sub-item (e.g., Chair, Microscope)")
    purchase_date = models.DateField(help_text="Date of purchase")
    cost = models.DecimalField(max_digits=10, decimal_places=2, help_text="Cost in Rs")
    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default="Pending",
        help_text="Payment status: Paid, Partial, Pending"
    )

    def __str__(self):
        return f"{self.main_category} - {self.sub_item} ({self.payment_status})"


class Expense(models.Model):
    category = models.CharField(
        max_length=50,
        choices=EXPENSE_CATEGORIES, # Using the correct choices for expenses
        default="Miscellaneous",
        help_text="Select main category (e.g., Utilities, Snacks)"
    )
    description = models.CharField(
        max_length=100,
        help_text="Specify details (e.g., October Bill, Tea for Guests)"
    )
    expense_date = models.DateField(
        default=timezone.now, 
        help_text="Date when expense occurred"
    )
    amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        help_text="Cost in Rs"
    )
    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default="Paid",
        help_text="Payment status: Paid, Pending"
    )

    def __str__(self):
        return f"{self.category} - {self.description} (Rs {self.amount})"
    

User = get_user_model()

class Investment(models.Model):
    item = models.CharField(max_length=255)  # Name or type of investment
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='investments')
    amount = models.DecimalField(max_digits=12, decimal_places=2)  # Amount invested
    date = models.DateField()  # Investment date
    description = models.TextField(blank=True, null=True)  # Optional description
    created_at = models.DateTimeField(auto_now_add=True)  # Record creation timestamp
    updated_at = models.DateTimeField(auto_now=True)      # Record update timestamp

    def __str__(self):
        return f"{self.item} - {self.user.username} - {self.amount}"

