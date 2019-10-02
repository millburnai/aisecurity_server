"""kioskserver URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls import url
from rest_framework import routers
from api import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'students', views.StudentViewSet, basename="Student")
router.register(r'transactions', views.TransactionViewSet)
router.register(r'studentinout', views.StudentDateInOutStatusViewSet)

urlpatterns = [
    url(r'^v1/', include(router.urls)),
    path('v1/students/revert', views.revertStudent),
    path('v1/students/strikes', views.getStrikes),
    path('v1/download/students', views.downloadStudent),
    path('v1/download/transactions', views.downloadTransaction),
    path('v1/morning', views.getMorningMode),
    path('v1/morning/set', views.setMorningMode),
    path('v1/admin/', admin.site.urls),
    path('kiosk/login', views.kioskLogin),
    path('', views.IndexWebApp),
    path('students', views.IndexWebApp),
    path('history', views.IndexWebApp),
    path('live', views.IndexWebApp),
    path('tardies', views.IndexWebApp),
]
