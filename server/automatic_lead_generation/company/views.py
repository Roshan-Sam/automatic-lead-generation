from rest_framework.response import Response
from rest_framework.decorators import permission_classes
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken,AccessToken
from rest_framework.permissions import IsAuthenticated
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from rest_framework.views import APIView
from .models import CompanyLog
from .serializers import CompanyLogSerializer

# Create your views here.

class CompanyRegistrationView(APIView):
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

            password = data.get('password')
            if len(password) < 6:
                return Response({"error": "Password must be at least 6 characters long"}, status=status.HTTP_400_BAD_REQUEST)

            username = data.get('username')
            if CompanyLog.objects.filter(username=username).exists():
                return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)

            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class RegisteredCompaniesView(APIView):
    def get(self, request):
        company_name = request.query_params.get('company_name', None)
        sector = request.query_params.get('sector', None)
        sort_by_date = request.query_params.get('sort_by_date', None)
        limit = request.query_params.get('limit', None)
        offset = request.query_params.get('offset', 0)   

        try:
            if limit:
                limit = int(limit)
            offset = int(offset)
        except ValueError:
            return Response({"error": "Invalid limit or offset parameter"}, status=status.HTTP_400_BAD_REQUEST)

        companies = CompanyLog.objects.filter(position__iexact='company').order_by('-register_date')

        if company_name:
            companies = companies.filter(company_name__icontains=company_name)
        if sector:
            companies = companies.filter(sector__icontains=sector)

        if sort_by_date:
            if sort_by_date == 'asc':
                companies = companies.order_by('register_date')
            elif sort_by_date == 'desc':
                companies = companies.order_by('-register_date')
                
        if limit is not None:
            companies = companies[offset:offset + limit]
        else:
            companies = companies[offset:]

        serializer = CompanyLogSerializer(companies, many=True)
        data = serializer.data
        for company in data:
            company.pop('password', None)  

        return Response(data,status=status.HTTP_200_OK)
    
class CompanyLoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = CompanyLog.objects.get(username=username)
        except CompanyLog.DoesNotExist:
            return Response({'error': 'Username or password is invalid'}, status=status.HTTP_400_BAD_REQUEST)
        
        if user.password != password:
            return Response({'error': 'Username or password is invalid'}, status=status.HTTP_400_BAD_REQUEST)
        
        refresh = RefreshToken.for_user(user)
        user_details = CompanyLogSerializer(user).data
        user_details.pop('password', None)
        
        return Response({'token': str(refresh.access_token), 'user': user_details}, status=status.HTTP_200_OK)