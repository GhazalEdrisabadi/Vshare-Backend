# Generated by Django 3.1 on 2021-04-21 19:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_remove_account_is_private'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='is_private',
            field=models.BooleanField(default=False),
        ),
    ]