from django.urls import path
from . import views
from .views import CreateCompany,UpdateCompanyView,DeleteCompany,SubscriptionPlanCreateView,UpdateSubscriptionPlanView,UpdateProfileView,UpdatePasswordView

urlpatterns = [
    path('admin/create/company/', CreateCompany.as_view()),
    path('admin/update/company/<int:company_id>/', UpdateCompanyView.as_view()),
    path('admin/delete/company/<int:company_id>/', DeleteCompany.as_view()),
    path('admin/create-subscription-plan/', SubscriptionPlanCreateView.as_view()),
    path('admin/update-subscription-plan/<int:plan_id>/', UpdateSubscriptionPlanView.as_view()),
    path('admin/update-profile/<int:profile_id>/', UpdateProfileView.as_view()),
    path('admin/update-password/<int:profile_id>/', UpdatePasswordView.as_view()),
]