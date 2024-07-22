from rest_framework import serializers
from .models import SubscriptionPlan,AdminNotification,CompanySubscription,ProductService,ProductImage,Category,Plan,ProductPurchases
from company.serializers import CompanyLogSerializer


class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = '__all__'
        
class SubscriptionPlanSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()
    plan = PlanSerializer(read_only=True)

    class Meta:
        model = SubscriptionPlan
        fields = '__all__'
        
    def get_product(self, obj):
        product_instance = obj.product
        if product_instance:
            serializer = ProductServiceSerializer(product_instance)
            return serializer.data
        return None
        
class AdminNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminNotification
        fields = '__all__'
        
class CompanySubscriptionSerializer(serializers.ModelSerializer):
    subscription_plan = serializers.SerializerMethodField()
    company = serializers.SerializerMethodField()

    class Meta:
        model = CompanySubscription
        fields = '__all__'
        
    def get_subscription_plan(self, obj):
        subscription_plan_obj = obj.subscription_plan
        serializer = SubscriptionPlanSerializer(subscription_plan_obj)
        return serializer.data

    def get_company(self, obj):
        company_obj = obj.company
        serializer = CompanyLogSerializer(company_obj)
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
    
class ProductPurchasesSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()
    company = serializers.SerializerMethodField()

    class Meta:
        model = ProductPurchases
        fields = '__all__'

    def get_product(self, obj):
        product_instance = obj.product
        if product_instance:
            serializer = ProductServiceSerializer(product_instance)
            return serializer.data
        return None

    def get_company(self, obj):
        company_instance = obj.company
        if company_instance:
            serializer = CompanyLogSerializer(company_instance)
            return serializer.data
        return None
