# Generated by Django 3.1.7 on 2021-05-30 15:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notifications', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notification',
            name='notification_type',
            field=models.IntegerField(choices=[(1, 'Friend-Requests-Count'), (2, 'Group-Requests-Count'), (3, 'Friend-Request-State'), (4, 'Group-Request-State'), (5, 'New-Follower'), (6, 'Group-Notice')]),
        ),
    ]