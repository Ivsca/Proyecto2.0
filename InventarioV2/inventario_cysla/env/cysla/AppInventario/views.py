import json
from django.core.paginator import Paginator
from .decoradores import login_requerido
from multiprocessing import connection
from django.conf import settings 
from_email=settings.EMAIL_HOST_USER,
from django.contrib.auth.models import User
from django.utils.timezone import now
from django.core.mail import send_mail
from django.utils import timezone
from django.views.decorators.http import require_POST
from django.shortcuts import render,redirect,get_object_or_404
from .models import TablaRazas,TipoDocumentos,Usuarios,Ganado, TipoCultivo, Cultivo, NotificacionCultivo
from django.core.serializers import serialize
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import TipoParcela
import os
from datetime import datetime, date, timedelta
from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest
from django.shortcuts import render, redirect, get_object_or_404



from .models import (
    TablaRazas,
    TipoDocumentos,
    Usuarios,
    Ganado,
    TipoCultivo,
    Cultivo,
    Enfermedades,
    TablaVacunas,
    Fertilizacion,
    TipoParcela,
)


# Create your views here.

# region Home
def Home(request):
    return render(request,'Home.html')
# endregion

# region Logueo

def plantilla_logue(request):
    tipos_documentos = TipoDocumentos.objects.all()
    return render(request, 'Logueo/Logueo.html', {
        'tipos_documentos': tipos_documentos
    })
# region solicitudes de acceso
@login_requerido
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

@login_requerido
def SolicitudAceptada(request, id_solicitud):
    solicitud = Usuarios.objects.get(id=id_solicitud)
    solicitud.estado = "Usuario"
    solicitud.save()
    return redirect("TablaSolicitudesUsuarios")

@login_requerido
def EliminarSolicitud(request,id_solicitud):
    Solicitud = Usuarios.objects.get(id=id_solicitud)
    Solicitud.delete()
    return redirect("TablaSolicitudesUsuarios")
# endregion
@login_requerido
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
        estado = "Solicitud"  # ✅ Ahora se requiere aprobación del admin

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
            return redirect('registro_exitoso')   
        except TipoDocumentos.DoesNotExist:
            return HttpResponse('Tipo de documento inválido', status=400)
    return HttpResponse('Método no permitido', status=405)

def registro_exitoso(request):
    return render(request, 'Logueo/creado.html')

def registro_exitoso(request):
    return render(request, 'Logueo/creado.html')
#endregion 
# region Login

def LoginUser(request):
    if request.method == "POST":
        username = request.POST.get("username")
        clave = request.POST.get("clave")
        try:
            usuario = Usuarios.objects.get(username=username, clave=clave)
            if usuario.estado == "Solicitud":
                return render(request, "Logueo/nocreada.html", {
                    "error": "Tu cuenta aún no ha sido aprobada por el administrador.",
                    "tipos_documentos": TipoDocumentos.objects.all()
                })

            # Guardar en sesión
            request.session["usuario_id"] = usuario.id
            request.session["username"] = usuario.username
            request.session["rol"] = usuario.rol

            return redirect("Home")  # o tu página de inicio
        except Usuarios.DoesNotExist:
            return render(request, "Logueo/Logueo.html", {
                "error": "Credenciales inválidas",
                "tipos_documentos": TipoDocumentos.objects.all()
            })
    else:
        # Si es GET y ya está logueado, ir al home
        if request.session.get("usuario_id"):
            return redirect("Home")

        # Si no está logueado, mostrar login
        return redirect("PlantillaLogueo")
def nocreada(request):
    return render(request, 'Logueo/nocreado.html')


def logout_view(request):
    request.session.flush()  # Elimina todos los datos de sesión
    return redirect("Home") 
#endregion 



# region ganado
@login_requerido
def TablaGanado(request):
    ganado_list = Ganado.objects.all()
    paginator = Paginator(ganado_list, 9)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    enfermedades = Enfermedades.objects.all()
    vacunas = TablaVacunas.objects.all()
    Razas = TablaRazas.objects.all()
    parcelas = TipoParcela.objects.all()

    return render(request, 'Ganado/Table.html', {
        'page_obj': page_obj,
        "enfermedades": enfermedades,
        "vacunas": vacunas,
        "Razas": Razas,
        'parcelas': parcelas
    })
@login_requerido
def buscar_codigo_ganado(request):
    q = request.GET.get('q', '').strip()
    resultados = []
    if q:
        resultados = list(Ganado.objects.filter(codigocria__icontains=q).values('id', 'codigocria'))
    # Devuelve id y código
    return JsonResponse([{'id': r['id'], 'codigo': r['codigocria']} for r in resultados], safe=False)

@login_requerido
def EliminarVacuno(id):
    vacuno = get_object_or_404(Ganado, id=id)
    vacuno.delete()
    return redirect('TablaGanado')
@login_requerido
def ListaRazas(request):
    razas = TablaRazas.objects.all().values('id', 'nombre')
    return JsonResponse(list(razas), safe=False)
@csrf_exempt
@login_requerido
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

@csrf_exempt
@login_requerido
def registrar_ganado(request):
    if request.method == "POST":
        try:
            codigocria = request.POST.get('CodigoCria')
            foto = request.FILES.get('Foto')
            foto_name = ''
            if foto:
                from django.core.files.storage import default_storage
                foto_name = default_storage.save('ganado/' + foto.name, foto)
            crias = request.POST.get('Crias', '0')
            codigoscrias = request.POST.get('CodigosCrias', '[]')
            codigopapa = request.POST.get('CodigoPapa', '')
            codigomama = request.POST.get('CodigoMama', '')
            edad = request.POST.get('Edad', '')
            infovacunas = request.POST.get('Vacunas', '[]')
            enfermedades = request.POST.get('Enfermedades', '[]')
            estado = request.POST.get('Estado', '')
            idparcela = request.POST.get('IdParcela', '')
            razas = request.POST.get('Razas', '')

            ganado = Ganado.objects.create(
                codigocria=codigocria,
                foto=foto_name,
                crias=crias,
                codigoscrias=codigoscrias,
                codigopapa=codigopapa,
                codigomama=codigomama,
                edad=edad,
                infovacunas=infovacunas,
                enfermedades=enfermedades,
                estado=estado,
                idparcela_id=idparcela,
                razas=razas
            )
            return JsonResponse({'success': True, 'id': ganado.id})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    return JsonResponse({'success': False, 'error': 'Método no permitido'}, status=405)

@csrf_exempt
@login_requerido
def actualizar_ganado(request, id):
    if request.method == "POST":
        try:
            ganado = Ganado.objects.get(id=id)
            ganado.codigocria = request.POST.get('CodigoCria')
            ganado.foto = request.POST.get('Foto', '')
            ganado.crias = request.POST.get('Crias', '0')
            ganado.codigoscrias = request.POST.get('CodigosCrias', '[]')
            ganado.codigopapa = request.POST.get('CodigoPapa', '')
            ganado.codigomama = request.POST.get('CodigoMama', '')
            ganado.edad = request.POST.get('Edad', '')
            ganado.infovacunas = request.POST.get('Vacunas', '[]')
            ganado.enfermedades = request.POST.get('Enfermedades', '[]')
            ganado.codigoscrias = request.POST.get('CodigosCrias', '[]')
            ganado.crias = request.POST.get('Crias', '0')
            ganado.estado = request.POST.get('Estado', '')
            ganado.idparcela_id = request.POST.get('IdParcela', '')
            ganado.razas = request.POST.get('Razas', '')
            ganado.save()
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    return JsonResponse({'success': False, 'error': 'Método no permitido'}, status=405)

from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
@login_requerido
def obtener_ganado(request, id):
    try:
        vacuno = Ganado.objects.get(id=id)
        return JsonResponse({
            'id': vacuno.id,
            'codigocria': vacuno.codigocria,
            'edad': vacuno.edad,
            'estado': vacuno.estado,
            'idparcela': vacuno.idparcela_id,
            'codigomama': vacuno.codigomama,
            'codigopapa': vacuno.codigopapa,
            'razas': vacuno.razas,
            'enfermedades': vacuno.enfermedades,
            'infovacunas': vacuno.infovacunas,
            'codigoscrias': vacuno.codigoscrias,
            'foto': vacuno.foto.url if vacuno.foto else '',
        })
    except Ganado.DoesNotExist:
        return JsonResponse({'error': 'Vacuno no encontrado'}, status=404)

# endregion

# region cultivo
@login_requerido
def TablaCultivo(request):
    if request.method == 'POST':
        nombre = request.POST.get('nombre', '').strip()
        tipo_id = request.POST.get('tipo_id', '').strip()
        parcela_id = request.POST.get('parcela_id', '').strip()
        fecha_siembra = request.POST.get('fecha_siembra', '').strip()
        fecha_cosecha = request.POST.get('fecha_cosecha', '').strip()
        cantidad = request.POST.get('cantidad', '').strip()
        foto = request.FILES.get('foto')

        if not nombre or not tipo_id or not parcela_id or not fecha_siembra or not fecha_cosecha or not cantidad or not foto:
            return JsonResponse({'error': 'Todos los campos son obligatorios, incluyendo la imagen.'}, status=400)

        cultivo = Cultivo(
            nombre=nombre,
            tipo_id=tipo_id,
            idparcela_id=parcela_id if parcela_id else None,
            fecha_siembra=fecha_siembra,
            fecha_cosecha=fecha_cosecha,
            cantidad=cantidad,
            foto=foto,
        )
        cultivo.save()
        return JsonResponse({'message': 'Cultivo agregado con éxito'})

    cultivos_list = Cultivo.objects.select_related('tipo', 'idparcela').all()
    paginator = Paginator(cultivos_list, 6)  # 6 cultivos por página (puedes ajustar)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, 'Cultivo/Table.html', {
        'page_obj': page_obj,
        'tipos_cultivo': TipoCultivo.objects.all(),
        'parcelas': TipoParcela.objects.all(),
        'user_rol': request.session.get("rol", "Usuario")
    })
@login_requerido
def obtener_cultivo(request, id):
    try:
        cultivo = Cultivo.objects.select_related('tipo', 'idparcela').get(pk=id)
        return JsonResponse({
            'id': cultivo.id,
            'nombre': cultivo.nombre,
            'tipo_id': cultivo.tipo_id,
            'parcela_id': cultivo.idparcela.id if cultivo.idparcela else None,
            'parcela_nombre': cultivo.idparcela.nombre if cultivo.idparcela else '',
            'parcela_estado': cultivo.idparcela.estado if cultivo.idparcela else None,
                        'tipo_nombre': cultivo.tipo.nombre_tipo if cultivo.tipo else '',
            'fecha_siembra': cultivo.fecha_siembra.strftime('%Y-%m-%d'),
            'fecha_cosecha': cultivo.fecha_cosecha.strftime('%Y-%m-%d'),
            'cantidad': cultivo.cantidad,
            'foto': cultivo.foto.url if cultivo.foto else '',
        })
    except Cultivo.DoesNotExist:
        return JsonResponse({'error': 'Cultivo no encontrado'}, status=404)
  
def obtener_fertilizaciones(request, cultivo_id):
    cultivo = Cultivo.objects.get(id=cultivo_id)

    fertilizaciones = Fertilizacion.objects.filter(cultivo_id=cultivo_id).values(
        'fecha', 'fertilizante', 'tipo', 'dosis', 'observaciones'  
    )
    return JsonResponse({
        'fertilizaciones': list(fertilizaciones),
        'fecha_siembra': cultivo.fecha_siembra.strftime('%Y-%m-%d'),
        'fecha_cosecha': cultivo.fecha_cosecha.strftime('%Y-%m-%d'),
    })

@csrf_exempt
def agregar_fertilizacion(request, cultivo_id):
    if request.method == 'POST':
        fecha = request.POST.get('fecha')
        fertilizante = request.POST.get('fertilizante')
        tipo = request.POST.get('tipo', 'QUIMICO')  # Valor por defecto 'QUIMICO'
        dosis = request.POST.get('dosis', '')  # Campo opcional
        observaciones = request.POST.get('observaciones', '')

        try:
            cultivo = Cultivo.objects.get(id=cultivo_id)
            fecha_fert = datetime.strptime(fecha, '%Y-%m-%d').date()

            # Validaciones de fecha
            if fecha_fert < cultivo.fecha_siembra:
                return HttpResponseBadRequest('La fecha no puede ser anterior a la siembra.')
            if fecha_fert > cultivo.fecha_cosecha:
                return HttpResponseBadRequest('La fecha no puede ser posterior a la cosecha.')

            # Crear registro con los nuevos campos
            Fertilizacion.objects.create(
                cultivo=cultivo,
                fecha=fecha_fert,
                fertilizante=fertilizante,
                tipo=tipo,          
                dosis=dosis,        
                observaciones=observaciones
            )
            return JsonResponse({'message': 'Registro nutricional guardado con éxito'})

        except Cultivo.DoesNotExist:
            return HttpResponseBadRequest('Cultivo no encontrado')
        except Exception as e:
            return HttpResponseBadRequest(str(e))


@login_requerido

def editar_cultivo(request):
    if request.method == 'POST':
        cultivo_id = request.POST.get('id')
        nombre = request.POST.get('nombre', '').strip()
        if not nombre:
            return JsonResponse({'error': 'El nombre del cultivo no puede estar vacío'}, status=400)
        try:
            cultivo = Cultivo.objects.get(pk=cultivo_id)
            cultivo.nombre = request.POST.get('nombre')
            cultivo.tipo_id = request.POST.get('tipo_id')
            cultivo.parcela_id = request.POST.get('parcela_id', None)
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
@login_requerido
def eliminar_cultivo(request):
    cultivo_id = request.POST.get('id')
    try:
        cultivo = Cultivo.objects.get(pk=cultivo_id)
        cultivo.delete()
        return JsonResponse({'message': 'Cultivo eliminado con éxito'})
    except Cultivo.DoesNotExist:
        return JsonResponse({'error': 'El cultivo no existe'}, status=404)



@login_requerido
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

@login_requerido
def obtener_tipoCultivos(request):
    tipos = list(TipoCultivo.objects.values("id", "nombre_tipo"))
    return JsonResponse(tipos, safe=False)

@csrf_exempt
@login_requerido
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



def generar_notificaciones_cultivo():
    hoy = timezone.now().date()
    usuarios = Usuarios.objects.filter(estado='activo')  # Solo usuarios activos
    cultivos = Cultivo.objects.all()

    for cultivo in cultivos:
        # Notificación de cosecha (3 días antes)
        if cultivo.fecha_cosecha:
            dias_restantes = (cultivo.fecha_cosecha - hoy).days
            if dias_restantes == 3:
                mensaje = f"⚠️ Cosecha próxima: '{cultivo.nombre}' se cosechará en {dias_restantes} días ({cultivo.fecha_cosecha})."
                _crear_notificaciones(cultivo, usuarios, mensaje, "cosecha")

        # Lógica de fertilización (optimizada)
        ultima_fertilizacion = Fertilizacion.objects.filter(cultivo=cultivo).order_by('-fecha').first()
        
        if not ultima_fertilizacion:
            mensaje = f"🔴 Alerta: '{cultivo.nombre}' no ha sido fertilizado."
            _crear_notificaciones(cultivo, usuarios, mensaje, "sin_fertilizar")
        elif (hoy - ultima_fertilizacion.fecha).days >= 30:
            mensaje = f"🟡 Recordatorio: '{cultivo.nombre}' necesita nueva fertilización (última: {ultima_fertilizacion.fecha})."
            _crear_notificaciones(cultivo, usuarios, mensaje, "re_fertilizar")

def _crear_notificaciones(cultivo, usuarios, mensaje, tipo):
    for usuario in usuarios:
        # Evitar duplicados en el mismo día
        if NotificacionCultivo.objects.filter(
            cultivo=cultivo,
            usuario=usuario,
            tipo=tipo,
            fecha__date=timezone.now().date()
        ).exists():
            continue

        # Crear notificación
        notificacion = NotificacionCultivo.objects.create(
            cultivo=cultivo,
            usuario=usuario,
            mensaje=mensaje,
            tipo=tipo
        )

        # Enviar email solo si el usuario tiene correo
        if usuario.correo:
            try:
                send_mail(
                    subject=f"Notificación de {cultivo.nombre}",
                    message=mensaje,
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[usuario.correo],
                    fail_silently=False
                )
                notificacion.leido = True  # Marcar como leído si email se envió
                notificacion.save()
            except Exception as e:
                print(f"Error enviando email a {usuario.correo}: {e}")


@login_requerido
def generar_notificaciones(request):
    """Vista para ejecutar manualmente la generación de notificaciones."""
    generar_notificaciones_cultivo()
    return JsonResponse({'estado': 'ok'})


@login_requerido
def obtener_notificaciones_cultivo(request):
    """Devuelve las notificaciones del usuario autenticado."""
    notis = NotificacionCultivo.objects.filter(usuario=request.user).order_by('-fecha')

    data = [{
        'mensaje': n.mensaje,
        'tipo': n.tipo,
        'leido': n.leido,
        'fecha': n.fecha.strftime('%Y-%m-%d %H:%M')
    } for n in notis]

    return JsonResponse({'notificaciones': data})


@login_requerido
def historial_notificaciones_cultivo(request):
    usuario = request.user
    notificaciones = NotificacionCultivo.objects.filter(usuario=usuario).order_by('-fecha')
    return render(request, 'notificacion_cultivo/historial.html', {'notificaciones': notificaciones})

# endregion

#RegionParcelas
@login_requerido
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
@login_requerido
def listar_parcelas(request):
    parcelas = TipoParcela.objects.all().values('id', 'nombre', 'estado')
    return JsonResponse(list(parcelas), safe=False)

@csrf_exempt
@require_POST
@login_requerido
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
@login_requerido    
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
# endregion

# region Raza
@login_requerido  

@login_requerido  
def ListaRazas(request):
    razas = TablaRazas.objects.all().values('id', 'nombre')
    return JsonResponse(list(razas), safe=False)
@csrf_exempt
@login_requerido
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