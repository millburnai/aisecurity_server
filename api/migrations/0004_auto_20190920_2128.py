# Generated by Django 2.2.5 on 2019-09-20 21:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_transaction_movement'),
    ]

    operations = [
        migrations.CreateModel(
            name='StudentDateInOutStatus',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('status', models.BooleanField()),
            ],
        ),
        migrations.RemoveField(
            model_name='student',
            name='in_school',
        ),
        migrations.AddField(
            model_name='student',
            name='end_states',
            field=models.ManyToManyField(to='api.StudentDateInOutStatus'),
        ),
    ]