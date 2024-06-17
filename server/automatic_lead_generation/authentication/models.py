from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import timedelta
from django.utils import timezone
# Create your models here.

class User(AbstractUser):
    profile = models.ImageField(upload_to='profile/',default='default profile.jpg',null=True,blank=True)
    user_type = models.CharField(max_length=20, null=True, blank=True)
