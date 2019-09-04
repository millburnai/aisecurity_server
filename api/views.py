from django.shortcuts import render
from rest_framework import viewsets
from .models import Student, Transaction
from django.contrib.auth.models import User, Group
from .serializers import UserSerializer, GroupSerializer, StudentSerializer, TransactionSerializer

# Create your views here.s

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
