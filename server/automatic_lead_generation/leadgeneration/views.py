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