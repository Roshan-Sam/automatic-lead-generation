from rest_framework import serializers
from .models import User,CompanyLog

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ['password']
    
class CompanyLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyLog
        fields = '__all__'

