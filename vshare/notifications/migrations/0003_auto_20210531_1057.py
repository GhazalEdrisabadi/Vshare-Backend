# Generated by Django 3.1.7 on 2021-05-31 10:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notifications', '0002_auto_20210530_1536'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notification',
            name='notification_type',
            field=models.IntegerField(choices=[(1, 'Friend-Requests-Count'), (2, 'Group-Requests-Count'), (3, 'Friend-Request-State'), (4, 'Group-Request-State'), (5, 'New-Follower'), (6, 'Group-Notice-Count'), (7, 'Group-Notice')]),
        ),
    ]