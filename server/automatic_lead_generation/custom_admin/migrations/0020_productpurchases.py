# Generated by Django 5.0.6 on 2024-07-21 04:46

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('company', '0001_initial'),
        ('custom_admin', '0019_companysubscription_notify_before_expire_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProductPurchases',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('purchase_id', models.CharField(blank=True, max_length=100, null=True, unique=True)),
                ('purchase_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('status', models.CharField(blank=True, default='Pending', max_length=20, null=True)),
                ('quantity', models.PositiveIntegerField(blank=True, default=1, null=True)),
                ('amount', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('company', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='company.companylog')),
                ('product', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='custom_admin.productservice')),
            ],
        ),
    ]
