from django.db import models
from auditlog.registry import auditlog
from django.contrib.auth.models import AbstractUser
from auditlog.models import AuditlogHistoryField

# Create your models here.

class CustomUser(AbstractUser):
	google_oath_token = models.CharField(max_length=512)

class StudentDateInOutStatus(models.Model):
	date = models.DateField()
	in_school = models.BooleanField()
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
	
	def clean(self):
		return {"name": self.name, "student_id": self.student_id, "grade": self.grade, "privilege_granted": self.privilege_granted}

	def toggleIn(self, date_lookup):
		records = self.end_states.all().filter(date=date_lookup)
		print(len(records))
		if len(records) == 0:
			p = StudentDateInOutStatus(date=date_lookup, in_school=False)
			p.save()
			self.end_states.add(p)
			return False
		elif len(records) == 1:
			records[0].in_school = not records[0].in_school
			records[0].save()
			return records[0].in_school
		else:
			print("THIS IS VERY BAD")
			return False

	def getIn(self, date_lookup):
		records = self.end_states.all().filter(date=date_lookup)
		if len(records) == 0:
			p = StudentDateInOutStatus(date=date_lookup, in_school=True)
			p.save()
			self.end_states.add(p)
			return False
		elif len(records) == 1:
			return records[0].in_school
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
	entering = models.BooleanField()

auditlog.register(Student)
