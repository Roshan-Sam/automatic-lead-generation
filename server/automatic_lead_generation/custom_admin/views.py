from rest_framework.response import Response
from rest_framework.decorators import permission_classes
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from rest_framework.views import APIView
from django.utils.html import strip_tags
from django.template.loader import render_to_string
from company.models import CompanyLog
from company.serializers import CompanyLogSerializer
from .models import SubscriptionPlan,AdminNotification,CompanySubscription,ProductService,ProductImage,Category,Plan,ProductPurchases
from .serializers import SubscriptionPlanSerializer,AdminNotificationSerializer,CompanySubscriptionSerializer,ProductServiceSerializer,CategorySerializer,ProductImageSerializer,PlanSerializer,ProductPurchasesSerializer
import random
import string   
from django.db.models import Q
import base64
from django.core.mail import EmailMessage

class CreateCompany(APIView):
    def post(self, request):
        data = request.data
        serializer = CompanyLogSerializer(data=data)

        if serializer.is_valid():
            email = data.get('email')
            if CompanyLog.objects.filter(email=email).exists():
                return Response({"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)

            phone = data.get('phone')
            if len(phone) != 10:
                return Response({"error": "Phone number must be 10 digits"}, status=status.HTTP_400_BAD_REQUEST)

            username = data.get('username')
            if CompanyLog.objects.filter(username=username).exists():
                return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)

            random_number = ''.join(random.choices(string.digits, k=3))
            password = username + random_number

            company_log = serializer.save(password=password)
            
            print(company_log)

            subject = 'Your Account Details - Username and Password'
            html_message = render_to_string("password.html", {
                'username': username,
                'password': password,
                'company_name': data.get('company_name'),
                'login_url': 'http://localhost:5173/login'
            })
            plain_message = strip_tags(html_message)
            from_email = settings.DEFAULT_FROM_EMAIL
            to = email

            message = EmailMultiAlternatives(
                subject=subject,
                body=plain_message,
                from_email=from_email,
                to=[to]
            )
            message.attach_alternative(html_message, "text/html")
            message.send()
            
            serialized_data = CompanyLogSerializer(company_log).data

            serialized_data.pop('password', None)

            return Response(serialized_data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UpdateCompanyView(APIView):
    def put(self, request, company_id):
        try:
            company = CompanyLog.objects.get(id=company_id)
        except CompanyLog.DoesNotExist:
            return Response({"error": "Company not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = CompanyLogSerializer(company, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class DeleteCompany(APIView):
    def delete(self, request, company_id):
        try:
            company = CompanyLog.objects.get(id=company_id)
            company.delete()
            return Response({"message": "Company deleted successfully"}, status=status.HTTP_200_OK)
        except CompanyLog.DoesNotExist:
            return Response({"error": "Company not found"}, status=status.HTTP_404_NOT_FOUND)
        
class AddPlanAPIView(APIView):
    def get(self, request):
        plans = Plan.objects.all()
        serializer = PlanSerializer(plans, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = PlanSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Plan created successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk):
        try:
            plan = Plan.objects.get(pk=pk)
        except Plan.DoesNotExist:
            return Response({"error": "Plan not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = PlanSerializer(plan, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Plan updated successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        try:
            plan = Plan.objects.get(pk=pk)
        except Plan.DoesNotExist:
            return Response({"error": "Plan not found"}, status=status.HTTP_404_NOT_FOUND)

        plan.delete()
        return Response({"message": "Plan deleted successfully"}, status=status.HTTP_200_OK)

class SubscriptionPlanCreateView(APIView):
    def post(self, request):
        data = request.data
        plan_id = data.pop('plan', None)
        product_ids = data.pop('products', [])
        
        try:
            plan_instance = Plan.objects.get(id=plan_id)
        except Plan.DoesNotExist:
            return Response({'error': 'Plan does not exist'}, status=status.HTTP_400_BAD_REQUEST)

        for product_id in product_ids:
            try:
                product_instance = ProductService.objects.get(id=product_id)
            except ProductService.DoesNotExist:
                return Response({'error': f'Product with id {product_id} does not exist'}, status=status.HTTP_400_BAD_REQUEST)

            SubscriptionPlan.objects.create(
                plan_name=data.get('plan_name'),
                description=data.get('description'),
                features=data.get('features'),
                monthly_price=data.get('monthly_price'),
                annual_price=data.get('annual_price'),
                custom_price=data.get('custom_price'),
                duration_in_months=data.get('duration_in_months'),
                product=product_instance,
                plan=plan_instance
            )
        return Response({'message': 'Product subscription plan created successfully'}, status=status.HTTP_200_OK)
    
    def get(self, request):
        plan_id = request.query_params.get('plan_id', None)
        if plan_id:
            plans = SubscriptionPlan.objects.filter(plan__id=plan_id)
        else:
            plans = SubscriptionPlan.objects.all()
        
        serializer = SubscriptionPlanSerializer(plans, many=True)
        return Response({"data": serializer.data}, status=status.HTTP_200_OK)
    
class UpdateSubscriptionPlanView(APIView):
    def put(self, request, plan_id):
        data = request.data
        product_id = data.pop('product', None)
        plan_instance = Plan.objects.filter(id=data.get('plan', None)).first()
        product_instance = ProductService.objects.filter(id=product_id).first()

        if not plan_instance:
            return Response({'error': 'Plan does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        if not product_instance:
            return Response({'error': 'Product does not exist'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            subscription_plan = SubscriptionPlan.objects.get(id=plan_id)
        except SubscriptionPlan.DoesNotExist:
            return Response({'error': 'Product subscription plan does not exist'}, status=status.HTTP_404_NOT_FOUND)

        subscription_plan.plan_name = data.get('plan_name', subscription_plan.plan_name)
        subscription_plan.description = data.get('description', subscription_plan.description)
        subscription_plan.features = data.get('features', subscription_plan.features)
        subscription_plan.monthly_price = data.get('monthly_price', subscription_plan.monthly_price)
        subscription_plan.annual_price = data.get('annual_price', subscription_plan.annual_price)
        subscription_plan.custom_price = data.get('custom_price', subscription_plan.custom_price)
        subscription_plan.duration_in_months = data.get('duration_in_months', subscription_plan.duration_in_months)
        subscription_plan.product = product_instance
        subscription_plan.plan = plan_instance

        subscription_plan.save()

        serializer = SubscriptionPlanSerializer(subscription_plan)
        return Response({'message': 'Product subscription plan updated successfully', 'data': serializer.data}, status=status.HTTP_200_OK)
    
    def delete(self, request, plan_id):
        try:
            plan = SubscriptionPlan.objects.get(id=plan_id)
            plan.delete()
            return Response({'message': 'Product subscription plan deleted successfully.'}, status=status.HTTP_200_OK)
        except SubscriptionPlan.DoesNotExist:
            return Response({'error': 'Product subscription plan not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        
class UpdateProfileView(APIView):
    def put(self, request, profile_id):
        try:
            company = CompanyLog.objects.get(id=profile_id)
        except CompanyLog.DoesNotExist:
            return Response({"error": "Company not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = CompanyLogSerializer(company, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            serialized_data = serializer.data
            serialized_data.pop('password', None)
            return Response(serialized_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UpdatePasswordView(APIView):
    def put(self, request, profile_id):
        try:
            company = CompanyLog.objects.get(id=profile_id)
        except CompanyLog.DoesNotExist:
            return Response({"error": "Company not found"}, status=status.HTTP_404_NOT_FOUND)
        
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')
        
        if not current_password and not new_password:
            return Response({"error": "Both current and new passwords are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not current_password:
            return Response({"error": "Current password is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not new_password:
            return Response({"error": "New password is required"}, status=status.HTTP_400_BAD_REQUEST)

        if current_password != company.password:
            return Response({"error": "Current password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)
        
        if len(new_password) < 6:
            return Response({"error": "New password must be at least 6 characters long"}, status=status.HTTP_400_BAD_REQUEST)
        
        company.password = new_password
        company.save()
        
        return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)
    
class AdminNotificationListView(APIView):
    def get(self, request):
        notifications = AdminNotification.objects.all().order_by('-created_at')
        serializer = AdminNotificationSerializer(notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = AdminNotificationSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class MarkNotificationAsReadView(APIView):
    def put(self, request, notification_id):
        try:
            notification = AdminNotification.objects.get(id=notification_id)
        except AdminNotification.DoesNotExist:
            return Response({"error": "Notification not found"}, status=status.HTTP_404_NOT_FOUND)
        
        notification.is_read = True
        notification.save()
        
        serializer = AdminNotificationSerializer(notification)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class CompanySubscriptionListView(APIView):
    def get(self, request):
        search_term = request.query_params.get('search', '')
        status_filter = request.query_params.get('status', '')
        limit = request.query_params.get('limit', None)
        offset = request.query_params.get('offset', 0)   
        
        try:
            if limit:
                limit = int(limit)
            offset = int(offset)
        except ValueError:
            return Response({"error": "Invalid limit or offset parameter"}, status=status.HTTP_400_BAD_REQUEST)
        
        subscriptions = CompanySubscription.objects.select_related('subscription_plan', 'company').order_by('-created_at')
        
        if search_term:
            subscriptions = subscriptions.filter(
                Q(company__company_name__icontains=search_term) |
                Q(subscription_plan__plan_name__icontains=search_term)          
            )
            
        if status_filter:
            subscriptions = subscriptions.filter(status=status_filter)
            
        total_count = subscriptions.count()
        
        if limit is not None:
            subscriptions = subscriptions[offset:offset + limit]
        else:
            subscriptions = subscriptions[offset:]
            
        serializer = CompanySubscriptionSerializer(subscriptions, many=True)
        return Response({"company_subscriptions": serializer.data, 'total_count':total_count}, status=status.HTTP_200_OK)
    
    def post(self, request):
        data = request.data
        
        company_id = data.get('company')
        subscription_plan_id = data.get('subscription_plan')

        try:
            company_log = CompanyLog.objects.get(id=company_id)
        except CompanyLog.DoesNotExist:
            return Response({'error': 'Company name does not exist'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            subscription_plan_obj = SubscriptionPlan.objects.get(id=subscription_plan_id)
        except SubscriptionPlan.DoesNotExist:
            return Response({'error': 'Subscription plan does not exist'}, status=status.HTTP_400_BAD_REQUEST)

        company_subscription = CompanySubscription.objects.create(
            company=company_log,
            subscription_plan=subscription_plan_obj,
            start_date=data.get('start_date'),
            end_date=data.get('end_date'),
            period=data.get('period')
        )

        serializer = CompanySubscriptionSerializer(company_subscription)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class CompanySubscriptionUpdateStatusView(APIView):
    def patch(self, request, pk):
        try:
            subscription = CompanySubscription.objects.get(pk=pk)
        except CompanySubscription.DoesNotExist:
            return Response({'error': 'CompanySubscription does not exist'}, status=status.HTTP_404_NOT_FOUND)

        subscription.status = request.data.get('status', subscription.status)
        subscription.save()

        serializer = CompanySubscriptionSerializer(subscription)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request, pk):
        try:
            subscription = CompanySubscription.objects.get(pk=pk)
        except CompanySubscription.DoesNotExist:
            return Response({'error': 'CompanySubscription does not exist'}, status=status.HTTP_404_NOT_FOUND)

        data = request.data
        subscription_plan_id = data.get('subscription_plan')
        try:
            subscription_plan = SubscriptionPlan.objects.get(id=subscription_plan_id)
        except SubscriptionPlan.DoesNotExist:
            return Response({'error': 'Subscription plan does not exist'}, status=status.HTTP_400_BAD_REQUEST)

        subscription.subscription_plan = subscription_plan
        subscription.start_date = data.get('start_date')
        subscription.end_date = data.get('end_date')
        subscription.period=data.get('period')
        subscription.save()

        serializer = CompanySubscriptionSerializer(subscription)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class CompanySubscriptionUpdateNotifyView(APIView):
    def patch(self, request, pk):
        try:
            subscription = CompanySubscription.objects.get(pk=pk)
        except CompanySubscription.DoesNotExist:
            return Response({'error': 'CompanySubscription does not exist'}, status=status.HTTP_404_NOT_FOUND)

        if 'notify_before_expire' in request.data:
            subscription.notify_before_expire = request.data['notify_before_expire']

        if 'notify_on_expire' in request.data:
            subscription.notify_on_expire = request.data['notify_on_expire']

        subscription.save()

        serializer = CompanySubscriptionSerializer(subscription)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class CompanySubscriptionDeleteView(APIView):
    def delete(self, request, pk):
        try:
            subscription = CompanySubscription.objects.get(pk=pk)
            subscription.delete()
            return Response(status=status.HTTP_200_OK)
        except CompanySubscription.DoesNotExist:
            return Response({'error': 'CompanySubscription does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
class ProductFeaturesView(APIView):
    def get(self, request):
        limit = request.query_params.get('limit', None) 
        offset = int(request.query_params.get('offset', 0))
        search_term = request.query_params.get('search', '')
        category = request.query_params.get('category', '')

        if limit:
            limit = int(limit)
        
        products_query = ProductService.objects.all().order_by('-created_at')
        if search_term:
            products_query = products_query.filter(Q(name__icontains=search_term))

        if category:
            products_query = products_query.filter(category__name__iexact=category)
            
        if limit is not None:
            products = products_query[offset:offset + limit]
        else:
            products = products_query[offset:]
            
        total_count = products_query.count()
        
        serializer = ProductServiceSerializer(products, many=True)
        return Response({'products': serializer.data,'total_count': total_count}, status=status.HTTP_200_OK)
    
    def post(self, request):
        category_name = request.data.get('category', None)
        category_instance = Category.objects.filter(name=category_name).first()
        
        product_data = {
            'name': request.data.get('name'),
            'description': request.data.get('description'),
            'features': request.data.get('features'),
            'price': request.data.get('price'),
            'product_id': request.data.get('product_id'),
            'category': category_instance,
        }

        product_instance = ProductService.objects.create(**product_data)

        images_data = request.FILES.getlist("images")
        for image_data in images_data:
            ProductImage.objects.create(
                product=product_instance,
                image=image_data
            )

        product_serializer = ProductServiceSerializer(product_instance)
        return Response(product_serializer.data, status=status.HTTP_200_OK)
    
class ProductFeaturesUpdateView(APIView):
    def put(self, request, pid):
        try:
            product = ProductService.objects.get(id=pid)
            category_name = request.data.get('category', None)
            category_instance = Category.objects.filter(name=category_name).first()
            
            product.name = request.data.get('name', product.name)
            product.description = request.data.get('description', product.description)
            product.features = request.data.get('features', product.features)
            product.price = request.data.get('price', product.price)
            product.availability_status = request.data.get('availability_status', product.availability_status)
            product.product_id = request.data.get('product_id', product.product_id)
            product.category = category_instance if category_instance else product.category
            
            product.save()
            
            serializer = ProductServiceSerializer(product)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ProductService.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
    
class SingleProductView(APIView):
    def get(self, request, pid):
        try:
            product = ProductService.objects.get(pk=pid)
            serializer = ProductServiceSerializer(product)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ProductService.DoesNotExist:
            return Response({"message": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
        
    def delete(self, request, pid):
        try:
            product = ProductService.objects.get(pk=pid)
            product.delete()
            return Response({"message": "Product deleted successfully"}, status=status.HTTP_200_OK)
        except ProductService.DoesNotExist:
            return Response({"message": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
        
class ProductImagesView(APIView):
    def get(self, request, product_id):
        images = ProductImage.objects.filter(product_id=product_id)
        serializer = ProductImageSerializer(images, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, product_id):
        images = request.FILES.getlist('images')
        for image in images:
            ProductImage.objects.create(product_id=product_id, image=image)
        return Response({"message": "Images uploaded successfully"}, status=status.HTTP_200_OK)
    
class DeleteProductImageView(APIView):
    def delete(self, request, image_id):
        try:
            image = ProductImage.objects.get(pk=image_id)
            image.delete()
            return Response({"message": "Image deleted successfully"}, status=status.HTTP_200_OK)
        except ProductImage.DoesNotExist:
            return Response({"message": "Image not found"}, status=status.HTTP_404_NOT_FOUND)
        
class AddCategoryView(APIView):
    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        categories = Category.objects.all()  
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
     
    def put(self, request, pk):
        try:
            category = Category.objects.get(pk=pk)
        except Category.DoesNotExist:
            return Response({"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = CategorySerializer(category, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        try:
            category = Category.objects.get(pk=pk)
        except Category.DoesNotExist:
            return Response({"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND)
        
        category.delete()
        return Response({"message": "Category deleted successfully"}, status=status.HTTP_200_OK)

class ProductPurchaseSalesView(APIView):
    def get(self, request):
        limit = request.query_params.get('limit', None) 
        offset = int(request.query_params.get('offset', 0))
        search_term = request.query_params.get('search', '')
        product_name = request.query_params.get('product', '')
        company_name = request.query_params.get('company', '')
        sector_name = request.query_params.get('sector', '')

        if limit:
            limit = int(limit)
        
        purchases_query = ProductPurchases.objects.all().order_by('-purchase_date')

        if search_term:
            purchases_query = purchases_query.filter(
                Q(product__name__icontains=search_term) | 
                Q(company__company_name__icontains=search_term) |
                Q(status__icontains=search_term)
            )

        if product_name:
            purchases_query = purchases_query.filter(product__name__icontains=product_name)

        if company_name:
            purchases_query = purchases_query.filter(company__company_name__icontains=company_name)
            
        if sector_name:
            purchases_query = purchases_query.filter(company__sector__icontains=sector_name)

        if limit is not None:
            purchases = purchases_query[offset:offset + limit]
        else:
            purchases = purchases_query[offset:]
            
        total_count = purchases_query.count()
        
        serializer = ProductPurchasesSerializer(purchases, many=True)
        return Response({'purchases': serializer.data, 'total_count': total_count}, status=status.HTTP_200_OK)
    
    def delete(self, request, pk):
        try:
            purchase = ProductPurchases.objects.get(pk=pk)
            purchase.delete()
            return Response(status=status.HTTP_200_OK)
        except ProductPurchases.DoesNotExist:
            return Response({'error': 'Purchase not found'}, status=status.HTTP_404_NOT_FOUND)

class ProductPurchaseSalesUpdateView(APIView):
    def patch(self, request, pk):
        try:
            purchase = ProductPurchases.objects.get(pk=pk)
        except ProductPurchases.DoesNotExist:
            return Response({'error': 'ProductPurchase does not exist'}, status=status.HTTP_404_NOT_FOUND)

        purchase.status = request.data.get('status', purchase.status)
        purchase.save()

        serializer = ProductPurchasesSerializer(purchase)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class ProductPurchaseSalesMonthlyReport(APIView):
    def post(self, request, *args, **kwargs):
        pdf_data = request.data.get('pdfData')
        email_address = request.data.get('emailAddress')
        year = request.data.get('year')

        if not pdf_data or not email_address:
            return Response({'error': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Decode the base64 PDF data
            pdf_data = pdf_data.split(',')[1]
            pdf_file = base64.b64decode(pdf_data)

            # Create the email
            email = EmailMultiAlternatives(
                subject=f'Product Purchase Sales Report for {year}',
                body='Please find the attached product purchase sales report.',
                to=[email_address]
            )

            # Add HTML content (optional)
            html_content = f'<p>Please find the attached product purchase sales report for the year {year}.</p>'
            email.attach_alternative(html_content, 'text/html')

            # Attach the PDF file
            email.attach(f'product-purchase-sales-report-{year}.pdf', pdf_file, 'application/pdf')
            email.send()

            return Response({'message': 'Email sent successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)