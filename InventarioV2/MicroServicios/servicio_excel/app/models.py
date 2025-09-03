# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = True` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models



class Enfermedades(models.Model):
    nombre = models.CharField(db_column='nombre',max_length=150)

    class Meta:
        managed = True
        db_table = 'enfermedades'

    def __str__(self):
        return self.nombre


class Ganado(models.Model):
    codigocria = models.CharField(db_column='CodigoCria', max_length=12)
    foto = models.ImageField(upload_to='Ganado/', db_column='Foto', null=True, blank=True)
    crias = models.CharField(db_column='Crias', max_length=2)
    LitroLeche = models.CharField(db_column='LitrosLeche',max_length=2, default= 0)
    codigoscrias = models.TextField(db_column='CodigosCrias')  # JSON
    codigopapa = models.CharField(db_column='CodigoPapa', max_length=12)
    codigomama = models.CharField(db_column='CodigoMama', max_length=12)
    edad = models.CharField(db_column='Edad', max_length=2)
    infovacunas = models.TextField(db_column='InfoVacunas')  # JSON
    enfermedades = models.TextField(db_column='Enfermedades')  # JSON
    estado = models.CharField(db_column='Estado', max_length=7)

    # ForeignKey con valor por defecto
    idparcela = models.ForeignKey(
        'TipoParcela',
        models.DO_NOTHING,
        db_column='IdParcela',
        default=1  # Debe existir un registro con ID=1
    )

    razas = models.CharField(db_column='Razas', max_length=255)

    class Meta:
        managed = True
        db_table = 'ganado'

    def __str__(self):
        return f"Ganado {self.codigocria}"

    
class TablaVacunas(models.Model):
    nombre = models.CharField(max_length=255, db_column='nombre')

    class Meta:
        managed = True
        db_table = 'tablavacunas'

    def __str__(self):
        return self.nombre


class TablaRazas(models.Model):
    nombre = models.CharField(max_length=100)

    class Meta:
        managed = True
        db_table = 'tablarazas'

    def __str__(self):
        return self.nombre

class TipoDocumentos(models.Model):
    nombre = models.CharField(max_length=100)

    class Meta:
        managed = True
        db_table = 'tipo_documentos'

    def __str__(self):
        return self.nombre


class TipoParcela(models.Model):
    nombre = models.CharField(db_column='Nombre', max_length=100, default="Parcela Genérica")
    estado = models.CharField(db_column='Estado', max_length=9, default="Activo")

    class Meta:
        managed = True
        db_table = 'tipoparcela'

    def __str__(self):
        return f"{self.nombre} - {self.estado}"
