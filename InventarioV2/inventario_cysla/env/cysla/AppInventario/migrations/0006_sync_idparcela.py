from django.db import migrations

class Migration(migrations.Migration):
    dependencies = [
        ('AppInventario', '0005_add_parcela'), 
    ]

    operations = [
        migrations.RunPython(
            lambda apps, schema_editor: None,  # No hace nada (ya existe el campo)
            lambda apps, schema_editor: None    # Reversa vacía
        ),
    ]