from django.contrib import admin
from .models import SubscriptionPlan,AdminNotification,CompanySubscription,ProductService,ProductImage

# Register your models here.

admin.site.register(SubscriptionPlan)
admin.site.register(AdminNotification)
admin.site.register(CompanySubscription)
admin.site.register(ProductService)
admin.site.register(ProductImage)