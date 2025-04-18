# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


# class AuthGroup(models.Model):
#     name = models.CharField(unique=True, max_length=150)

#     class Meta:
#         managed = False
#         db_table = 'auth_group'


# class AuthGroupPermissions(models.Model):
#     id = models.BigAutoField(primary_key=True)
#     group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
#     permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

#     class Meta:
#         managed = False
#         db_table = 'auth_group_permissions'
#         unique_together = (('group', 'permission'),)


# class AuthPermission(models.Model):
#     name = models.CharField(max_length=255)
#     content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
#     codename = models.CharField(max_length=100)

#     class Meta:
#         managed = False
#         db_table = 'auth_permission'
#         unique_together = (('content_type', 'codename'),)


# class AuthUser(models.Model):
#     password = models.CharField(max_length=128)
#     last_login = models.DateTimeField(blank=True, null=True)
#     is_superuser = models.IntegerField()
#     username = models.CharField(unique=True, max_length=150)
#     first_name = models.CharField(max_length=150)
#     last_name = models.CharField(max_length=150)
#     email = models.CharField(max_length=254)
#     is_staff = models.IntegerField()
#     is_active = models.IntegerField()
#     date_joined = models.DateTimeField()

#     class Meta:
#         managed = False
#         db_table = 'auth_user'


# class AuthUserGroups(models.Model):
#     id = models.BigAutoField(primary_key=True)
#     user = models.ForeignKey(AuthUser, models.DO_NOTHING)
#     group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

#     class Meta:
#         managed = False
#         db_table = 'auth_user_groups'
#         unique_together = (('user', 'group'),)


# class AuthUserUserPermissions(models.Model):
#     id = models.BigAutoField(primary_key=True)
#     user = models.ForeignKey(AuthUser, models.DO_NOTHING)
#     permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

#     class Meta:
#         managed = False
#         db_table = 'auth_user_user_permissions'
#         unique_together = (('user', 'permission'),)


# class DjangoAdminLog(models.Model):
#     action_time = models.DateTimeField()
#     object_id = models.TextField(blank=True, null=True)
#     object_repr = models.CharField(max_length=200)
#     action_flag = models.PositiveSmallIntegerField()
#     change_message = models.TextField()
#     content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
#     user = models.ForeignKey(AuthUser, models.DO_NOTHING)

#     class Meta:
#         managed = False
#         db_table = 'django_admin_log'


# class DjangoContentType(models.Model):
#     app_label = models.CharField(max_length=100)
#     model = models.CharField(max_length=100)

#     class Meta:
#         managed = False
#         db_table = 'django_content_type'
#         unique_together = (('app_label', 'model'),)


# class DjangoMigrations(models.Model):
#     id = models.BigAutoField(primary_key=True)
#     app = models.CharField(max_length=255)
#     name = models.CharField(max_length=255)
#     applied = models.DateTimeField()

#     class Meta:
#         managed = False
#         db_table = 'django_migrations'


# class DjangoSession(models.Model):
#     session_key = models.CharField(primary_key=True, max_length=40)
#     session_data = models.TextField()
#     expire_date = models.DateTimeField()

#     class Meta:
#         managed = False
#         db_table = 'django_session'


class Enfermedades(models.Model):
    nombre = models.CharField(db_column='nombre',max_length=150)
    descripcion = models.CharField(db_column='Descripcion',max_length=150)

    class Meta:
        managed = False
        db_table = 'enfermedades'

    def __str__(self):
        return self.nombre


class Ganado(models.Model):
    codigocria = models.CharField(db_column='CodigoCria', max_length=12)  
    foto = models.CharField(db_column='Foto', max_length=255)  
    crias = models.CharField(db_column='Crias', max_length=2)  
    codigoscrias = models.CharField(db_column='CodigosCrias', max_length=255)  
    codigopapa = models.CharField(db_column='CodigoPapa', max_length=12)  
    codigomama = models.CharField(db_column='CodigoMama', max_length=12)  
    edad = models.CharField(db_column='Edad', max_length=2)  
    infovacunas = models.TextField(db_column='InfoVacunas')  
    enfermedades = models.CharField(db_column='Enfermedades', max_length=255)  
    estado = models.CharField(db_column='Estado', max_length=7)  
    idparcela = models.ForeignKey('Tipoparcela', models.DO_NOTHING, db_column='IdParcela')  
    razas = models.CharField(db_column='Razas', max_length=255)  

    class Meta:
        managed = False
        db_table = 'ganado'

    def __str__(self):
        return f"Ganado {self.codigocria}"


class TablaRazas(models.Model):
    nombre = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'tablarazas'

    def __str__(self):
        return self.nombre


class TipoDocumentos(models.Model):
    nombre = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'tipo_documentos'

    def __str__(self):
        return self.nombre


class TipoParcela(models.Model):
    nombre = models.CharField(db_column='Nombre', max_length=100)  
    estado = models.CharField(db_column='Estado', max_length=9)  

    class Meta:
        managed = False
        db_table = 'tipoparcela'

    def __str__(self):
        return f"{self.nombre} - {self.estado}"


class Usuarios(models.Model):
    username = models.CharField(db_column='UserName',max_length=100)
    nombres = models.CharField(db_column='Nombres', max_length=120)  
    apellidos = models.CharField(db_column='Apellidos', max_length=70)  
    correo = models.CharField(db_column='Correo', max_length=255)  
    idtipodocumento = models.ForeignKey(TipoDocumentos, models.DO_NOTHING, db_column='IdTipoDocumento')  
    numerodocumento = models.CharField(db_column='NumeroDocumento', max_length=12)  
    rol = models.CharField(db_column='Rol', max_length=7)  
    clave = models.CharField(db_column='Clave', max_length=100)  
    estado = models.CharField(db_column='Estado', max_length=9)  

    class Meta:
        managed = False
        db_table = 'usuarios'

    def __str__(self):
        return f"{self.nombres} {self.apellidos} ({self.rol})"
