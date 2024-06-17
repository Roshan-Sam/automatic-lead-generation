from rest_framework import serializers
from .models import CompanyLog

    
class CompanyLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyLog
        fields = '__all__'

