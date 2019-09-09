from django.shortcuts import render
from rest_framework import viewsets
from .models import Student, Transaction
from django.contrib.auth.models import User, Group
from .serializers import UserSerializer, GroupSerializer, StudentSerializer, TransactionSerializer
from rest_framework import generics
from django.contrib.auth import get_user_model
from datetime import datetime, timezone
from django.http import JsonResponse

# Create your views here

class UserViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class StudentViewSet(viewsets.ModelViewSet):
    serializer_class = StudentSerializer
    queryset = Student.objects.all()
    def get_queryset(self):
        token = self.request.headers.get('token', None)
        if token is None or len(get_user_model().objects.all().filter(google_oath_token=token)) == 0:
            return []

        queryset = Student.objects.all()
        name = self.request.query_params.get('name', None)
        if name is not None:
            queryset = queryset.filter(name__contains=name)
        grade = self.request.query_params.get('grade', None)
        if grade is not None:
            queryset = queryset.filter(grade=grade)
        student_id = self.request.query_params.get('student_id', None)
        if student_id is not None:
            queryset = queryset.filter(student_id__contains=student_id)
        privilege_granted = self.request.query_params.get('privilege_granted', None)
        if privilege_granted is not None:
            queryset = queryset.filter(privilege_granted=privilege_granted)
        return queryset

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    def get_queryset(self):
        token = self.request.headers.get('token')
        if token is None or len(get_user_model().objects.all().filter(google_oath_token=token)) == 0:
            return []

        queryset = Transaction.objects.all()
        kiosk_id = self.request.query_params.get('kiosk_id', None)
        if kiosk_id is not None:
            queryset = queryset.filter(kiosk_id=kiosk_id)
        
        entered_id = self.request.query_params.get('entered_id', None)
        if entered_id is not None:
            queryset = queryset.filter(entered_id=entered_id)

        from_datetime = self.request.query_params.get('from_datetime', None)
        if from_datetime is not None:
            queryset = queryset.filter(timestamp__gte=from_datetime)
        
        to_datetime = self.request.query_params.get('to_datetime', None)
        if to_datetime is not None:
            queryset = queryset.filter(timestamp__lte=to_datetime)

        db_stuid = self.request.query_params.get('db_stuid', None)
        if db_stuid is not None:
            queryset = queryset.filter(student__id=db_stuid)

        student_id = self.request.query_params.get('student_id', None)
        if student_id is not None:
            queryset = queryset.filter(student__student_id=student_id)

        student_name = self.request.query_params.get('student_name', None)
        if student_name is not None:
            queryset = queryset.filter(student__name__contains=student_name)
	
        return queryset

def kioskLogin(request):
    entered_id = request.GET['id']
    kiosk = request.GET['kiosk']

    search_student = Student.objects.all().filter(student_id=entered_id)
    if len(search_student) == 0:
         search_student = None
    else:
         search_student = search_student[0]

    Transaction.objects.create(kiosk_id=kiosk, student=search_student, entered_id=entered_id, timestamp=datetime.now(tz=timezone.utc), flag=False)
    if search_student is not None:
        return JsonResponse(data={"name": search_student.name, "accept": search_student.privilege_granted})
    return JsonResponse(data={"name": "Invalid ID", "accept": False})
