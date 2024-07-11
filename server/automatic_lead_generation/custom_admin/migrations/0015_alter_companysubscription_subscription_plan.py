# Generated by Django 5.0.6 on 2024-07-10 16:26

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('custom_admin', '0014_remove_subscriptionplan_product_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='companysubscription',
            name='subscription_plan',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='company_subscription', to='custom_admin.subscriptionplan'),
        ),
    ]