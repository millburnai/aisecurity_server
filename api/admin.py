from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from .models import Student, Transaction, CustomUser
from .forms import CustomUserCreationForm, CustomUserChangeForm

class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ['email', 'username',]
    fieldsets = UserAdmin.fieldsets
    fieldsets[1][1]['fields'] = ('first_name','last_name','email','google_oath_token')

# Register your models here.
#admin.site.register(User)
admin.site.register(Student)
admin.site.register(Transaction)
admin.site.register(CustomUser, CustomUserAdmin)
