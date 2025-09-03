from django.db import migrations

class Migration(migrations.Migration):
    dependencies = [
        ('AppInventario', '0006_sync_idparcela'),
    ]

    operations = [
        migrations.AlterModelTable(
            name='NotificacionCultivo',
            table='notificacion_cultivo',
        ),
    ]