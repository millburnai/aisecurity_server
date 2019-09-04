from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import Student, Transaction, MorningMode


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
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
    class Meta:
        model = Transaction
        fields = ['id', 'kiosk_id', 'student', 'entered_id', 'timestamp', 'flag']

