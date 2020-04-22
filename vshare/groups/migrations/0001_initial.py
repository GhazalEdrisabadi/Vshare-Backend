

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Group',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('since', models.DateTimeField(auto_now_add=True)),
                ('groupid', models.CharField(default='', max_length=20, unique=True, validators=[django.core.validators.RegexValidator('^[0-9a-zA-Z]*$', 'Only alphanumeric characters are allowed.')])),
                ('title', models.CharField(blank=True, default='No Name', max_length=100)),
                ('describtion', models.TextField(blank=True)),
                ('invite_only', models.BooleanField(default=False)),
                ('status', models.CharField(choices=[(0, 'no action'), (1, 'video selected by owner'), (2, 'check validation'), (3, 'video played by owner')], default=0, max_length=32)),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='owner', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['since'],
            },
        ),
        migrations.CreateModel(
            name='Membership',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_joined', models.DateTimeField(auto_now_add=True)),
                ('the_group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='groups.Group', to_field='groupid')),
                ('the_member', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['date_joined'],
                'unique_together': {('the_group', 'the_member')},
            },
        ),
        migrations.AddField(
            model_name='group',
            name='members',
            field=models.ManyToManyField(blank=True, related_name='joined_groups', through='groups.Membership', to=settings.AUTH_USER_MODEL),
        ),
    ]
