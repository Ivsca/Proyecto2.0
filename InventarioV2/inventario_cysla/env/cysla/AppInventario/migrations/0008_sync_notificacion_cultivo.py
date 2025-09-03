from django.db import migrations

class Migration(migrations.Migration):
    dependencies = [
        ('AppInventario', '0007_notificacion_cultivo_table'),
    ]

    operations = [
        migrations.AlterModelTable(
            name='NotificacionCultivo',
            table='notificacion_cultivo',  
        ),
    ]