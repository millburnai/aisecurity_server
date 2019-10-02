from django.shortcuts import render
from rest_framework import viewsets
from .models import Student, Transaction, StudentDateInOutStatus
from django.contrib.auth.models import User, Group
from .serializers import UserSerializer, GroupSerializer, StudentSerializer, TransactionSerializer, StudentDateInOutStatusSerializer
from django.contrib.auth import get_user_model
from datetime import datetime, timezone, date
from django.http import JsonResponse, HttpResponse
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.forms.models import model_to_dict
import csv
import pytz as tz
from . import IN_MORNING_MODE


# idk if this is done right, just change it if it isn't
def IndexWebApp(request):
    return render(request, 'index.html')

# Create your views here


class UserViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.all().order_by('-date_joined')
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class StudentDateInOutStatusViewSet(viewsets.ModelViewSet):
        queryset = StudentDateInOutStatus.objects.all()
        serializer_class = StudentDateInOutStatusSerializer


def getTransactionSet(request):
    queryset = Transaction.objects.all()
    kiosk_id = request.GET.get('kiosk_id', None)
    if kiosk_id is not None:
        queryset = queryset.filter(kiosk_id=kiosk_id)
    entered_id = request.GET.get('entered_id', None)
    if entered_id is not None:
        queryset = queryset.filter(entered_id=entered_id)
    from_datetime = request.GET.get('from_datetime', None)
    if from_datetime is not None:
        queryset = queryset.filter(timestamp__gte=from_datetime)
    to_datetime = request.GET.get('to_datetime', None)
    if to_datetime is not None:
        queryset = queryset.filter(timestamp__lte=to_datetime)
    student_id = request.GET.get('student_id', None)
    if student_id is not None:
        queryset = queryset.filter(student__student_id=student_id)
    student_name = request.GET.get('student_name', None)
    if student_name is not None:
        queryset = queryset.filter(student__name__contains=student_name)
    morning = request.GET.get('morning_mode', None)
    if morning is not None:
        queryset = queryset.filter(morning_mode=morning)
    flag = request.GET.get('flag', None)
    if flag is not None:
        queryset = queryset.filter(flag=flag)

    return queryset

def getStudentSet(request):
    queryset = Student.objects.all()
    name = request.GET.get('name', None)
    if name is not None:
        queryset = queryset.filter(name__contains=name)
    grade = request.GET.get('grade', None)
    if grade is not None:
        queryset = queryset.filter(grade=grade)
    student_id = request.GET.get('student_id', None)
    if student_id is not None:
        queryset = queryset.filter(student_id__contains=student_id)
    privilege_granted = request.GET.get('privilege_granted', None)
    if privilege_granted is not None:
        queryset = queryset.filter(privilege_granted=privilege_granted)
    return queryset


class StudentViewSet(viewsets.ModelViewSet):
    serializer_class = StudentSerializer
    queryset = Student.objects.all()

    def get_queryset(self):
        return getStudentSet(self.request)


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

    def get_queryset(self):
        return getTransactionSet(self.request)


def downloadStudent(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="student_download.csv"'
    writer = csv.writer(response)
    writer.writerow(['name', 'student_id', 'grade', 'privilege_granted', 'pathToImage'])
    for student in getStudentSet(request):
        writer.writerow([
            student.name,
            student.student_id,
            student.grade,
            student.privilege_granted,
            student.pathToImage,
        ])
    return response


def downloadTransaction(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="transaction_download.csv"'
    writer = csv.writer(response)
    writer.writerow(['internal_id', 'entered_id', 'student_name', 'student_id', 'date', 'time', 'morning', 'entering', 'flagged'])
    for transaction in getTransactionSet(request):
        writer.writerow([
            transaction.pk,
            transaction.entered_id,
            transaction.student.name if transaction.student is not None else "N/A",
            transaction.student.student_id if transaction.student is not None else "N/A",
            transaction.timestamp.astimezone(tz.timezone("America/New_York")).strftime("%x"),
            transaction.timestamp.astimezone(tz.timezone("America/New_York")).strftime("%X"),
            transaction.morning_mode,
            transaction.entering,
            transaction.flag,
        ])
    return response


def kioskLogin(request):
    entered_id = request.GET.get('id', "")
    kiosk = request.GET.get('kiosk', "")

    if kiosk == "" or entered_id == "":
        return HttpResponse(status=400)


    search_student = Student.objects.all().filter(student_id=entered_id)
    search_student = None if len(search_student) == 0 else search_student[0]

    automorningmode = datetime.now().hour == 11 and datetime.now().minute > 45
    gen_morning = IN_MORNING_MODE or automorningmode

    autoflag = False
    if search_student is not None:
        autoflag = search_student.privilege_granted == 0 and gen_morning == False

    movement = False
    if search_student is not None:
        if not gen_morning:
            movement = search_student.toggleIn(date.today())
        else:
            movement = True

    trans_id = Transaction.objects.create(kiosk_id=kiosk, student=search_student, entered_id=entered_id, timestamp=datetime.now(tz=timezone.utc), morning_mode=gen_morning, flag=autoflag, entering=movement).id


    async_to_sync(get_channel_layer().group_send)("security", {'type': 'message', 'message': {
        "id": trans_id,
        'kiosk_id': kiosk,
        'student': search_student.clean() if search_student is not None else None,
        'entered_id': entered_id,
        'timestamp': str(datetime.now(tz=timezone.utc)),
        'morning_mode': gen_morning,
        'flag': autoflag,
        'entering': movement,
    }})

    if search_student is not None:
        accepted = True if gen_morning else search_student.privilege_granted
        return JsonResponse(data={"name": search_student.name,
                                  "accept": True if gen_morning else search_student.privilege_granted,
                                  "seniorPriv": True if gen_morning else search_student.privilege_granted,
                                  "id": search_student.student_id,
                                  "in": movement,
                                  }
                            )

    return JsonResponse(data={"name": "Invalid ID", "accept": False, "id": 00000, "seniorPriv": 0, "in": 0})


def revertStudent(request):
    def fix(val, current):
        return val[1] if val is not None else current

    student_primary_key = int(request.GET.get('id', None))
    revision_revert = int(request.GET.get('revert', None))
    s = Student.objects.all().get(pk=student_primary_key)
    num_entries =  len(Student.objects.all().get(pk=student_primary_key).history.all())
    if num_entries > revision_revert:
        for i in range(revision_revert+1):
            n = Student.objects.all().get(pk=student_primary_key).history.all()[::-1][i].changes_display_dict
            s.name = fix(n.get("name", None), s.name)
            s.student_id = fix(n.get("student id", None), s.student_id)
            s.grade = fix(n.get("grade", None), s.grade)
            s.privilege_granted = fix(n.get("privilege granted", None), s.privilege_granted)
            s.pathToImage = fix(n.get("pathToImage", None), s.pathToImage)
    s.save()
    return JsonResponse(data={})


def getStrikes(request):
    data = []
    for student in getStudentSet(request):
        d = {}
        d['student'] = student.clean()
        d['strikes'] = []
        d['num_strikes'] = 0
        d['num_unresolved_strikes'] = 0
        for state in student.end_states.all():
            if state.in_school == False:
                d['strikes'].append(model_to_dict(state))
                d['num_strikes'] += 1
                if not state.resolved:
                    d['num_unresolved_strikes'] += 1
        if d['num_strikes'] != 0:
            data.append(d)
    return JsonResponse(data=data, safe=False)


def getMorningMode(request):
    return JsonResponse(data={"status": IN_MORNING_MODE})


def setMorningMode(request):
    global IN_MORNING_MODE
    setTo = True if int(request.GET.get("status", "None")) == 1 else False
    IN_MORNING_MODE = setTo
    return getMorningMode(request)
