from django.urls import path
from . import views
from .views import CompanyRegisterView,CompanyUsersView,LoginView

urlpatterns = [
    path('',views.index),
    path('register/company/', CompanyRegisterView.as_view()),
    path('company/users/', CompanyUsersView.as_view()),
    path('login/', LoginView.as_view()),
]