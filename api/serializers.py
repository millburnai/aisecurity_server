from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import Student, Transaction, StudentDateInOutStatus
from django.contrib.auth import get_user_model
from datetime import datetime, timezone, date

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['url', 'username', 'email', 'groups']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']

class StudentDateInOutStatusSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = StudentDateInOutStatus
        fields = ['date', 'in_school', 'resolved']

class StudentSerializer(serializers.HyperlinkedModelSerializer):
    in_school = serializers.SerializerMethodField('get_end_states')

    def get_end_states(self, student):
        qs = student.end_states.all().filter(date=date.today()).all()
        status = qs[0].in_school if len(qs) != 0 else True
        return status

    class Meta:
        model = Student
        fields = ['student_id', 'name', 'grade', 'privilege_granted', 'pathToImage', 'in_school']

class TransactionSerializer(serializers.HyperlinkedModelSerializer):
    student = StudentSerializer()
    class Meta:
        model = Transaction
        fields = ['id', 'kiosk_id', 'student', 'entered_id', 'timestamp', 'morning_mode', 'flag', 'entering']
