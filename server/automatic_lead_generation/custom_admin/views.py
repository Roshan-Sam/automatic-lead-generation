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
from .models import SubscriptionPlan
from .serializers import SubscriptionPlanSerializer
import random
import string   

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
        
class SubscriptionPlanCreateView(APIView):
    def post(self, request):
        serializer = SubscriptionPlanSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data, 'message': 'Subscription plan created successfully.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        plans = SubscriptionPlan.objects.all()
        serializer = SubscriptionPlanSerializer(plans, many=True)
        return Response({"data": serializer.data}, status=status.HTTP_200_OK)
    
class UpdateSubscriptionPlanView(APIView):
    def put(self, request, plan_id):
        try:
            plan = SubscriptionPlan.objects.get(id=plan_id)
        except SubscriptionPlan.DoesNotExist:
            return Response({'error': 'Subscription plan not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = SubscriptionPlanSerializer(plan, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data, 'message': 'Subscription plan updated successfully.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, plan_id):
        try:
            plan = SubscriptionPlan.objects.get(id=plan_id)
            plan.delete()
            return Response({'message': 'Subscription plan deleted successfully.'}, status=status.HTTP_200_OK)
        except SubscriptionPlan.DoesNotExist:
            return Response({'error': 'Subscription plan not found.'}, status=status.HTTP_404_NOT_FOUND)