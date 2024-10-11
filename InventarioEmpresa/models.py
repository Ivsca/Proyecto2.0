from django.db import models

#---------------------------------------------------Normalizacion de codigo--------------------------------------------------------------

# para los nombres de las tablas de models debes usar mayuscula en la primera letra de cada palabra ejemplo: NombreTabla, etc
#------------------------------------------------------------------------------------------------------------------------------------------

# region tipo de cultivo
class TipoCultivo(models.Model):
    nombre = models.CharField(max_length=255)
    foto = models.CharField(max_length=255)

    class Meta:
        db_table = 'TipoCultivo'

    def __str__(self):
        return self.nombre

class Cultivo(models.Model):
    TipoCultivo_CHOICES = [
        ('FRUTA', 'Fruta'),
        ('VEGETAL', 'Vegetal'),
    ]
    CategoriaCultivo = models.CharField(max_length=8, choices=TipoCultivo_CHOICES)
    
    # Relación con TipoCultivo
    Tipo_Cultivo = models.ForeignKey(TipoCultivo, on_delete=models.CASCADE)

    Descripcion = models.TextField(max_length=400)
    cantidad = models.CharField(max_length=8)
    fecha_cultivado = models.DateField(auto_now_add=True)
    fecha_cosechado = models.DateField(null=True, blank=True)

    class Meta:
        db_table = 'cultivo'
# endregion

# region tipo de Ganado
class TipoRaza(models.Model):
    nombre = models.CharField(max_length=255, unique=True, null=None)
    ImagenRaza = models.CharField(max_length=255)

    class Meta:
        db_table = 'tiporaza'

class TipoParcela(models.Model):
    nombre = models.CharField(max_length=255, unique=True, null=None)

    class Meta:
        db_table = 'tipoparcela'

class Ganado(models.Model):
    PROPOSITO_CHOICES = [
        ('CARNE', 'Carne'),
        ('LECHE', 'Leche'),
        ('VENTA', 'Venta'),
    ]
    
    ESTADO_CHOICES = [
        ('MUERTA', 'Muerta'),
        ('INACTIVA', 'Inactiva'),
        ('VENDIDA', 'Vendida'),
        ('ACTIVA', 'Activa'),
    ]
    
    ORIGEN_CHOICES = [
        ('CRIADA', 'Criada'),
        ('REGALADA', 'Regalada'),
        ('COMPRADA', 'Comprada'),
    ]
    
    codigo = models.CharField(max_length=8, unique=True)
    ImagenVacuno= models.CharField(max_length=255,null=True, blank=True)
    crias = models.CharField(max_length=2)
    CodigoPapa = models.CharField(max_length=8)
    CodigoMama = models.CharField(max_length=8)
    raza = models.ForeignKey(TipoRaza, on_delete=models.CASCADE)
    edad = models.CharField(max_length=2)
    proposito = models.CharField(max_length=6, choices=PROPOSITO_CHOICES)
    estado = models.CharField(max_length=8, choices=ESTADO_CHOICES)
    vacunas = models.TextField(max_length=500)
    Dia_vacunada = models.DateField()
    Dia_caduca_vacunada = models.DateField()
    parcela = models.ForeignKey(TipoParcela, on_delete=models.CASCADE)
    alimentacion = models.TextField(max_length=500)
    enfermedades = models.TextField(max_length=500)
    origen = models.CharField(max_length=8, choices=ORIGEN_CHOICES)

    class Meta:
        db_table = 'ganado'
# endregion