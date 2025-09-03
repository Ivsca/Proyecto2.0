from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):
    dependencies = [
        ('AppInventario', '0008_sync_notificacion_cultivo'),
    ]

    operations = [
        migrations.RunSQL(
            sql="",  # Vacío porque el campo ya existe
            reverse_sql="",  # Vacío para reversa
            state_operations=[
                migrations.AddField(
                    model_name='cultivo',
                    name='idparcela',
                    field=models.ForeignKey(
                        blank=True,
                        db_column='IdParcela',
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to='AppInventario.TipoParcela'
                    ),
                ),
            ]
        )
    ]