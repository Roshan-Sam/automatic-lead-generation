from django.db import models
# Create your models here.


class SubscriptionPlan(models.Model):
    plan_name = models.CharField(max_length=255, unique=True, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    features = models.TextField(help_text="List of features included in the plan", null=True, blank=True)
    monthly_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    annual_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    custom_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    duration_in_months = models.PositiveIntegerField(default=1, null=True, blank=True)
    is_active = models.BooleanField(default=True, null=True, blank=True)    