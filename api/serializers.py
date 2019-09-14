from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import Student, Transaction
from django.contrib.auth import get_user_model

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['url', 'username', 'email', 'groups']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']


class StudentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'name', 'student_id', 'grade', 'privilege_granted', 'pathToImage']

class TransactionSerializer(serializers.HyperlinkedModelSerializer):
    student = StudentSerializer()
    class Meta:
        model = Transaction
        fields = ['id', 'kiosk_id', 'student', 'entered_id', 'timestamp', 'morning_mode', 'flag']

