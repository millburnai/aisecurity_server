from django.contrib import admin
from .models import Student, Transaction, MorningMode

# Register your models here.
admin.site.register(Student)
admin.site.register(Transaction)
admin.site.register(MorningMode)
