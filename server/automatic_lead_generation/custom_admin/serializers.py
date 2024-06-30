from rest_framework import serializers
from .models import SubscriptionPlan,AdminNotification,CompanySubscription,ProductService,ProductImage,Category
from company.serializers import CompanyLogSerializer

class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = '__all__'
        
class AdminNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminNotification
        fields = '__all__'
        
class CompanySubscriptionSerializer(serializers.ModelSerializer):
    subscription_plan = serializers.SerializerMethodField()
    company_name = serializers.SerializerMethodField()

    class Meta:
        model = CompanySubscription
        fields = '__all__'
        
    def get_subscription_plan(self, obj):
        subscription_plan_obj = obj.subscription_plan
        serializer = SubscriptionPlanSerializer(subscription_plan_obj)
        return serializer.data

    def get_company_name(self, obj):
        company_name_obj = obj.company_name
        serializer = CompanyLogSerializer(company_name_obj)
        return serializer.data
    
class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = '__all__'
        
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        
class ProductServiceSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()

    class Meta:
        model = ProductService
        fields = '__all__'
    
    def get_category(self, obj):
        category_instance = obj.category
        if category_instance:
            return CategorySerializer(category_instance).data
        return None
        
    def get_images(self, obj):
        images_queryset = ProductImage.objects.filter(product=obj)
        serializer = ProductImageSerializer(images_queryset, many=True, context=self.context)
        return serializer.data
