from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken,AccessToken
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from rest_framework.views import APIView
from .models import User
from .serializers import CompanyRegisterSerializer,UserSerializer
from django.contrib.auth import authenticate

# Create your views here.

@api_view(['GET'])
def index(request):
    return Response({"message":"hello"})

class CompanyRegisterView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = CompanyRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CompanyUsersView(APIView):
    def get(self, request):
        company_users = User.objects.filter(user_type='company')
        serializer = UserSerializer(company_users, many=True)
        return Response(serializer.data)
    
class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password') 
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            user = None
        user = authenticate(username=username, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            user_serializer = UserSerializer(user)
            user_details = user_serializer.data

            return Response({'token': str(refresh.access_token), 'user': user_details}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)