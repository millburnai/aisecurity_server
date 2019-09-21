from django.db import models
from auditlog.registry import auditlog
from django.contrib.auth.models import AbstractUser
from auditlog.models import AuditlogHistoryField

# Create your models here.

class CustomUser(AbstractUser):
	google_oath_token = models.CharField(max_length=512)

class StudentDateInOutStatus(models.Model):
	date = models.DateField()
	status = models.BooleanField()
	resolved = models.BooleanField(default=False)

class Student(models.Model):
	name = models.CharField(max_length=200)
	student_id = models.IntegerField(primary_key=True)
	grade = models.IntegerField()
	privilege_granted = models.BooleanField()
	pathToImage = models.CharField(max_length=200, blank=True)
	history = AuditlogHistoryField()
	end_states = models.ManyToManyField(StudentDateInOutStatus, blank=True)

	def __str__(self):
		return "Student: " + self.name

	def toggleIn(self, date_lookup):
		records = self.end_states.all().filter(date=date_lookup)
		print(len(records))
		if len(records) == 0:
			p = StudentDateInOutStatus(date = date_lookup, status=False)
			p.save()
			self.end_states.add(p)
			return False
		elif len(records) == 1:
			records[0].status = not records[0].status
			records[0].save()
			return records[0].status
		else:
			print("THIS IS VERY BAD")
			return False

	def getIn(self, date_lookup):
		records = self.end_states.all().filter(date=date_lookup)
		if len(records) == 0:
			p = StudentDateInOutStatus(date = date_lookup, status=True)
			p.save()
			self.end_states.add(p)
			return False
		elif len(records) == 1:
			return records[0].status
		else:
			print("THIS IS VERY BAD")
			return False

class Transaction(models.Model):
	kiosk_id = models.IntegerField()
	student = models.ForeignKey(Student, models.PROTECT, null=True)
	entered_id = models.IntegerField()
	timestamp = models.DateTimeField()
	morning_mode = models.BooleanField()
	flag = models.BooleanField()
	movement = models.BooleanField()

auditlog.register(Student)
