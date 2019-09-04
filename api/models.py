from django.db import models
from auditlog.registry import auditlog
from auditlog.models import AuditlogHistoryField

# Create your models here.

class Student(models.Model):
	name = models.CharField(max_length=200)
	student_id = models.IntegerField()
	grade = models.IntegerField()
	privilege_granted = models.BooleanField()
	pathToImage = models.CharField(max_length=200, blank=True)
	history = AuditlogHistoryField()
	def __str__(self):
		return "Student: " + self.name

class Transaction(models.Model):
	kiosk_id = models.IntegerField()
	student = models.ForeignKey(Student, models.PROTECT, null=True)
	entered_id = models.IntegerField()
	timestamp = models.DateTimeField()
	flag = models.BooleanField()
	
class MorningMode(models.Model):
	beingActivated = models.BooleanField()
	timestamp = models.DateTimeField()
	
auditlog.register(Student)

