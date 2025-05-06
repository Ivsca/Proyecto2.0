from django.shortcuts import render,redirect,get_object_or_404
from django.http import HttpResponse
from .models import TablaRazas,TipoDocumentos,Usuarios,Ganado
from django.core.serializers import serialize
from django.core.paginator import Paginator



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
# region solicitudes de acceso

def TablaSolicitudesUsuarios(request):
    usuarios = Usuarios.objects.filter(estado="Solicitud")
    return render(request, 'Logueo/Table.html',{
        'usuarios':usuarios
    })

# def TablaSolicitudesUsuarios(request):
#     solicitudes = Usuarios.objects.filter(estado="Solicitud").order_by("id")
#     paginator = Paginator(solicitudes, 5)  # Muestra 5 solicitudes por página
#     page_number = request.GET.get("page")
#     page_obj = paginator.get_page(page_number)
#     return render(request, 'Logueo/Table.html', {'page_obj': page_obj})


def SolicitudAceptada(request, id_solicitud):
    solicitud = Usuarios.objects.get(id=id_solicitud)
    solicitud.estado = "Usuario"
    solicitud.save()
    return redirect("TablaSolicitudesUsuarios")


def EliminarSolicitud(request,id_solicitud):
    Solicitud = Usuarios.objects.get(id=id_solicitud)
    Solicitud.delete()
    return redirect("TablaSolicitudesUsuarios")
# endregion

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

# region ganado
def TablaGanado(request):
    ganado = Ganado.objects.all()
    
    return render(request, 'Ganado/Table.html',{'ganado':ganado})

def EliminarVacuno(id):
    vacuno = get_object_or_404(Ganado, id=id)
    vacuno.delete()
    return redirect('TablaGanado')

def InfoBuscador(request,TipoBusqueda,valor):
    if TipoBusqueda == 'documento':
        ganado = Ganado.objects.filter(documento__icontains=valor)
    elif TipoBusqueda == 'nombre':
        ganado = Ganado.objects.filter(nombre__icontains=valor)
    elif TipoBusqueda == 'apellido':
        ganado = Ganado.objects.filter(apellido__icontains=valor)
    elif TipoBusqueda == 'celular':
        ganado = Ganado.objects.filter(celular__icontains=valor)
    elif TipoBusqueda == 'direccion':
        ganado = Ganado.objects.filter(direccion__icontains=valor)
    elif TipoBusqueda == 'cargo':
        ganado = Ganado.objects.filter(cargo__icontains=valor)
    else:
        ganado = Ganado.objects.none()
    
    ganadojson = serialize('json', ganado)
    return HttpResponse(ganadojson, content_type='application/json')
# endregion