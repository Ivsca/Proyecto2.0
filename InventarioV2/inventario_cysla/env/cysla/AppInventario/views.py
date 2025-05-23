from django.shortcuts import render,redirect,get_object_or_404
from django.http import HttpResponse, JsonResponse
from .models import TablaRazas,TipoDocumentos,Usuarios,Ganado,Cultivo
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



# region ganado
def TablaGanado(request):
    ganado = Ganado.objects.all()
    
    return render(request, 'Ganado/Table.html',{'ganado':ganado})


def EliminarVacuno(id):
    vacuno = get_object_or_404(Ganado, id=id)
    vacuno.delete()
    return redirect('TablaGanado')

# endregion

#region cultivo

def TablaCultivo(request):
    if request.method == 'POST':
        nombre = request.POST.get('nombre', '').strip()
        tipo = request.POST.get('tipo_cultivo', '').strip()
        fecha_siembra = request.POST.get('fecha_siembra', '').strip()
        fecha_cosecha = request.POST.get('fecha_cosecha', '').strip()
        cantidad = request.POST.get('cantidad', '').strip()
        foto = request.FILES.get('foto')

        if not nombre or not tipo or not fecha_siembra or not fecha_cosecha or not cantidad or not foto:
            return JsonResponse({'error': 'Todos los campos son obligatorios, incluyendo la imagen.'}, status=400)

        cultivo = Cultivo(
            nombre=nombre,
            tipo_cultivo=tipo,
            fecha_siembra=fecha_siembra,
            fecha_cosecha=fecha_cosecha,
            cantidad=cantidad,
            foto=foto
        )
        cultivo.save()
        return JsonResponse({'message': 'Cultivo agregado con éxito'})

    cultivos = Cultivo.objects.all()
    return render(request, 'Cultivo/Table.html', {'cultivos': cultivos})





def obtener_cultivo(request, id):
    try:
        cultivo = Cultivo.objects.get(pk=id)
        return JsonResponse({
            'id': cultivo.id,
            'nombre': cultivo.nombre,
            'tipo_cultivo': cultivo.tipo_cultivo,
            'fecha_siembra': cultivo.fecha_siembra.strftime('%Y-%m-%d'),
            'fecha_cosecha': cultivo.fecha_cosecha.strftime('%Y-%m-%d'),
            'cantidad': cultivo.cantidad,
            'foto': cultivo.foto.url if cultivo.foto else ''
        })
    except Cultivo.DoesNotExist:
        return JsonResponse({'error': 'Cultivo no encontrado'}, status=404)



def editar_cultivo(request):
    if request.method == 'POST':
        cultivo_id = request.POST.get('id')
        nombre = request.POST.get('nombre', '').strip()
        if not nombre:
            return JsonResponse({'error': 'El nombre del cultivo no puede estar vacío'}, status=400)
        try:
            cultivo = Cultivo.objects.get(pk=cultivo_id)
            cultivo.nombre = request.POST.get('nombre')
            cultivo.tipo_cultivo = request.POST.get('tipo_cultivo')
            cultivo.fecha_siembra = request.POST.get('fecha_siembra')
            cultivo.fecha_cosecha = request.POST.get('fecha_cosecha')
            cultivo.cantidad = request.POST.get('cantidad')
            
            if 'foto' in request.FILES:
                cultivo.foto = request.FILES['foto']

            cultivo.save()
            return JsonResponse({'message': 'Cultivo editado con éxito'})
        except Cultivo.DoesNotExist:
            return JsonResponse({'error': 'Cultivo no encontrado'}, status=404)

    return JsonResponse({'error': 'Método no permitido'}, status=405)


def eliminar_cultivo(request):
    cultivo_id = request.POST.get('id')
    try:
        cultivo = Cultivo.objects.get(pk=cultivo_id)
        cultivo.delete()
        return JsonResponse({'message': 'Cultivo eliminado con éxito'})
    except Cultivo.DoesNotExist:
        return JsonResponse({'error': 'El cultivo no existe'}, status=404)
    



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