from django.db import models
from company.models import CompanyLog
# Create your models here.

    
class AdminNotification(models.Model):
    message = models.CharField(max_length=255,null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False,null=True,blank=True)
    type = models.CharField(max_length=100, null=True, blank=True)
    
class Category(models.Model):
    name = models.CharField(max_length=255, null=True, blank=True)
    
class ProductService(models.Model):
    name = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    features = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    product_id = models.CharField(max_length=100, unique=True, null=True, blank=True)
    category = models.ForeignKey(Category, related_name='category', on_delete=models.CASCADE, null=True, blank=True)
    availability_status = models.CharField(max_length=20, default='In Stock', null=True, blank=True)

class ProductImage(models.Model):
    product = models.ForeignKey(ProductService, related_name='images', on_delete=models.CASCADE, null=True, blank=True)
    image = models.ImageField(upload_to='product_images/', null=True, blank=True)
    
class Plan(models.Model):
    name = models.CharField(max_length=255, unique=True, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
class SubscriptionPlan(models.Model):
    plan_name = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    features = models.TextField(help_text="List of features included in the plan", null=True, blank=True)
    monthly_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    annual_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    custom_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    duration_in_months = models.PositiveIntegerField(default=1, null=True, blank=True)
    is_active = models.BooleanField(default=True, null=True, blank=True) 
    product = models.ForeignKey(ProductService, related_name='subscription_plan', on_delete=models.CASCADE, null=True, blank=True)
    plan = models.ForeignKey(Plan, related_name='subscription_plans', on_delete=models.CASCADE, null=True, blank=True)

class CompanySubscription(models.Model):
    company_name = models.ForeignKey(CompanyLog, on_delete=models.CASCADE, null=True, blank=True)
    subscription_plan = models.ForeignKey(SubscriptionPlan, related_name='company_subscription', on_delete=models.CASCADE, null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=10, default='Pending', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    plan = models.ForeignKey(Plan, related_name='company_subscriptions', on_delete=models.CASCADE, null=True, blank=True)
