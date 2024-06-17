from django.db import models
from datetime import timedelta
from django.utils import timezone
# Create your models here.

class CompanyLog(models.Model):
    company_name = models.CharField(max_length=225,null=True,blank=True)
    username = models.CharField(max_length=255,null=True,blank=True)
    password = models.CharField(max_length=255,null=True,blank=True)
    register_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50,default='active',null=True,blank=True)
    email = models.EmailField(max_length=225,null=True,blank=True)
    phone = models.CharField(max_length=15,null=True,blank=True)
    sector = models.CharField(max_length=225,null=True,blank=True)
    log_in = models.DateTimeField(null=True,blank=True)
    log_out = models.DateTimeField(null=True,blank=True)
    position = models.CharField(max_length=7,default='company',null=True,blank=True)
    profile = models.ImageField(upload_to='company_profile/',default='default profile.jpg',null=True,blank=True)
