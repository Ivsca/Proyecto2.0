import json
from django.core.paginator import Paginator
from multiprocessing import connection
from django.views.decorators.http import require_POST
from django.shortcuts import render,redirect,get_object_or_404
from django.http import HttpResponse
from .models import TablaRazas,TipoDocumentos,Usuarios,Ganado, TipoCultivo, Cultivo
from django.core.serializers import serialize
from django.core.paginator import Paginator
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import TipoParcela
import os



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

# region cultivo
def TablaCultivo(request):
    if request.method == 'POST':
        nombre = request.POST.get('nombre', '').strip()
        tipo_id = request.POST.get('tipo_id', '').strip()  # Cambiado de tipo_cultivo a tipo_id
        fecha_siembra = request.POST.get('fecha_siembra', '').strip()
        fecha_cosecha = request.POST.get('fecha_cosecha', '').strip()
        cantidad = request.POST.get('cantidad', '').strip()
        foto = request.FILES.get('foto')

        if not nombre or not tipo_id or not fecha_siembra or not fecha_cosecha or not cantidad or not foto:
            return JsonResponse({'error': 'Todos los campos son obligatorios, incluyendo la imagen.'}, status=400)

        cultivo = Cultivo(
            nombre=nombre,
            tipo_id=tipo_id,  
            fecha_siembra=fecha_siembra,
            fecha_cosecha=fecha_cosecha,
            cantidad=cantidad,
            foto=foto
        )
        cultivo.save()
        return JsonResponse({'message': 'Cultivo agregado con éxito'})

    cultivos_list = Cultivo.objects.select_related('tipo').all()
    paginator = Paginator(cultivos_list, 6)  # 6 cultivos por página (puedes ajustar)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, 'Cultivo/Table.html', {
        'page_obj': page_obj,
        'tipos_cultivo': TipoCultivo.objects.all()  # Pasar los tipos disponibles al template
    })

def obtener_cultivo(request, id):
    try:
        cultivo = Cultivo.objects.select_related('tipo').get(pk=id)
        return JsonResponse({
            'id': cultivo.id,
            'nombre': cultivo.nombre,
            'tipo_id': cultivo.tipo_id,  
            'tipo_nombre': cultivo.tipo.nombre_tipo if cultivo.tipo else '', 
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
            cultivo.tipo_id = request.POST.get('tipo_id')  # Cambiado de tipo_cultivo a tipo_id
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

def obtener_tipoCultivos(request):
    tipos = list(TipoCultivo.objects.values("id", "nombre_tipo"))
    return JsonResponse(tipos, safe=False)

@csrf_exempt
def agregar_tipoCultivo(request):
    if request.method == "POST":
        data = json.loads(request.body)
        nombre = data.get("nombre_tipo", "").strip()
        if nombre:
            nuevo = TipoCultivo(nombre_tipo=nombre)
            nuevo.save()
            return JsonResponse({"success": True})
    return JsonResponse({"success": False}, status=400)

@csrf_exempt
def eliminar_tipoCultivo(request, id):
    if request.method == "DELETE":
        TipoCultivo.objects.filter(id=id).delete()
        return JsonResponse({"success": True})
    return JsonResponse({"success": False}, status=400)



# endregion

#RegionParcelas
def agregar_parcela(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            parcela = TipoParcela(
                nombre=data.get('nombre'),
                estado=data.get('estado')
            )
            parcela.save()
            return JsonResponse({'success': True, 'id': parcela.id})  # Cambiado a 'success'
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    return JsonResponse({'success': False, 'error': 'Método no permitido'})

def listar_parcelas(request):
    parcelas = TipoParcela.objects.all().values('id', 'nombre', 'estado')
    return JsonResponse(list(parcelas), safe=False)

@csrf_exempt
@require_POST
def activar(request, registro_id):
    try:
        parcela = TipoParcela.objects.get(id=registro_id)  # Cambiado a TipoParcela
        # Cambiar el estado (1 a 2 o 2 a 1)
        parcela.estado = 2 if parcela.estado == 1 else 1
        parcela.save()
        
        return JsonResponse({
            'success': True,
            'message': 'Estado de la parcela actualizado correctamente',
            'nuevo_estado': parcela.estado
        })
    except TipoParcela.DoesNotExist:  # Cambiado a TipoParcela
        return JsonResponse({
            'success': False,
            'message': 'Parcela no encontrada'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': str(e)
        }, status=500)
    
def Desactivar(request, registro_id):
    try:
        parcela = TipoParcela.objects.get(id=registro_id)  # Cambiado a TipoParcela
        # Cambiar el estado (1 a 2 o 2 a 1)
        parcela.estado = 2 if parcela.estado == 1 else 2
        parcela.save()
        
        return JsonResponse({
            'success': True,
            'message': 'Estado de la parcela actualizado correctamente',
            'nuevo_estado': parcela.estado
        })
    except TipoParcela.DoesNotExist:  # Cambiado a TipoParcela
        return JsonResponse({
            'success': False,
            'message': 'Parcela no encontrada'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': str(e)
        }, status=500)
    
def ListaRazas(request):
    razas = TablaRazas.objects.all().values('id', 'nombre')
    return JsonResponse(list(razas), safe=False)
@csrf_exempt
def AgregarRaza(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            razas = TablaRazas(
                nombre=data.get('nombre'),
            )
            razas.save()
            return JsonResponse({'success': True, 'id': razas.id})  # Cambiado a 'success'
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    return JsonResponse({'success': False, 'error': 'Método no permitido'})
#end region