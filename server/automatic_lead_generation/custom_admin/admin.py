from django.contrib import admin
from .models import SubscriptionPlan,AdminNotification,CompanySubscription

# Register your models here.

admin.site.register(SubscriptionPlan)
admin.site.register(AdminNotification)
admin.site.register(CompanySubscription)