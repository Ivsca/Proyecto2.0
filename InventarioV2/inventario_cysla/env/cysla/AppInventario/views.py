from django.shortcuts import render,redirect
from django.http import HttpResponse
from .models import TablaRazas,TipoDocumentos,Usuarios


# Create your views here.

# region Home
def Home(request):
    return render(request,'Home.html')
# endregion

# region Logueo
def plantilla_logue(request):
    tipos_documentos= TipoDocumentos.objects.all()
    return render(request,'Logueo/Logueo.html',{
        'tipos_documentos':tipos_documentos
    })

def TablaSolicitudesUsuarios(request):
    usuarios = Usuarios.objects.filter(estado="Solicitud")
    return render(request, 'Logueo/Table.html',{
        'usuarios':usuarios
    })

def TablaUsuarios(request):
    usuarios = Usuarios.objects.filter(estado="Usuario")
    return render(request, 'Logueo/Table.html',{
        'usuarios':usuarios
    })


# region Register
def RegisterUser(request):
    if request.method == "POST":
        nombre_usuario = request.POST['UserName']
        nombres = request.POST['Nombres']
        apellidos = request.POST['Apellidos']
        correo = request.POST['Correo']
        tipo_documento_id = request.POST['TipoDocumento']
        numero_documento = request.POST['NumeroDocumento']
        clave = request.POST['Clave1']
        rol = "Usuario"
        estado = "Usuario"
        # Convertir el ID recibido en objeto TipoDocumentos
        try:
            tipo_documento_obj = TipoDocumentos.objects.get(id=tipo_documento_id)
            Usuarios.objects.create(
                username=nombre_usuario,
                nombres=nombres,
                apellidos=apellidos,
                correo=correo,
                idtipodocumento=tipo_documento_obj,
                numerodocumento=numero_documento,
                rol=rol,
                clave=clave,
                estado=estado
            )
            return HttpResponse('Usuario registrado')   
        except TipoDocumentos.DoesNotExist:
            return HttpResponse('Tipo de documento inválido', status=400)
    return HttpResponse('Método no permitido', status=405)

#endregion 
# region Login

def LoginUser(request):
    return HttpResponse('bienvenido a la finca')

#endregion 

# endregion

# def info_razas(request):
#     razas = TablaRazas.objects.all()
#     return HttpResponse("razas")