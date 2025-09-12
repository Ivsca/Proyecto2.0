from django.contrib import admin
from .models import Enfermedades, Ganado,Cultivo, TablaRazas, TipoDocumentos, TipoParcela, Usuarios

admin.site.register(Enfermedades)
admin.site.register(Ganado)
admin.site.register(Cultivo)
admin.site.register(TablaRazas)
admin.site.register(TipoDocumentos)
admin.site.register(TipoParcela)
admin.site.register(Usuarios)
