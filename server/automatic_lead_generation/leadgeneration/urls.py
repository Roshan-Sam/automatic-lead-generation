from django.urls import path
from . import views
from .views import CompanyRegistrationView,RegisteredCompaniesView,CompanyLoginView

urlpatterns = [
    path('',views.index),
    path('register/company/', CompanyRegistrationView.as_view()),
    path('companies/', RegisteredCompaniesView.as_view()),
    path('login/', CompanyLoginView.as_view()),
]