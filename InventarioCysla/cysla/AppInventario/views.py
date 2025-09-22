import json
from django.core.paginator import Paginator
from .decoradores import login_requerido
from multiprocessing import connection
from django.views.decorators.http import require_POST
from django.shortcuts import render,redirect,get_object_or_404
from .models import TablaRazas,TipoDocumentos,Usuarios,Ganado, TipoCultivo, Cultivo
from django.core.serializers import serialize
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import TipoParcela
import os
from datetime import datetime, date, timedelta
from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
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
import re

from AppInventario.Notificaciones import NotificacionesCultivos


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

def Cambiarrol(request, id_usuario):
    usuario = get_object_or_404(Usuarios, id=id_usuario)

    # alternar rol
    if usuario.rol.lower() == "usuario":
        usuario.rol = "Admin"
    else:
        usuario.rol = "usuario"

    usuario.save()
    messages.success(request, f"Rol de {usuario.username} cambiado a {usuario.rol}")
    return redirect("TablaUsuarios")  # Usa el name de tu listado de usuarios

# region Register
def RegisterUser(request):
    if request.method == "POST":
        nombre_usuario = request.POST['UserName'].strip()
        nombres = request.POST['Nombres'].strip()
        apellidos = request.POST['Apellidos'].strip()
        correo = request.POST['Correo'].strip().lower()
        tipo_documento_id = request.POST['TipoDocumento']
        numero_documento = request.POST['NumeroDocumento'].strip()
        clave1 = request.POST['Clave1']
        clave2 = request.POST['Clave2']
        rol = "Usuario"
        estado = "Solicitud"  # ✅ usuario queda pendiente de aprobación admin

        # 🔹 1. Validar campos vacíos
        if not all([nombre_usuario, nombres, apellidos, correo, tipo_documento_id, numero_documento, clave1, clave2]):
            return HttpResponse("Todos los campos son obligatorios", status=400)

        # 🔹 2. Validar username
        if not re.match(r'^[a-zA-Z0-9_]{4,20}$', nombre_usuario):
            return HttpResponse("El nombre de usuario debe tener 4-20 caracteres y solo usar letras, números o _", status=400)
        if Usuarios.objects.filter(username=nombre_usuario).exists():
            return HttpResponse("El nombre de usuario ya está en uso", status=400)

        # 🔹 3. Validar correo
        if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', correo):
            return HttpResponse("Correo inválido", status=400)
        if Usuarios.objects.filter(correo=correo).exists():
            return HttpResponse("El correo ya está registrado", status=400)

        # 🔹 4. Validar documento
        if not numero_documento.isdigit():
            return HttpResponse("El número de documento debe ser numérico", status=400)
        if len(numero_documento) < 6 or len(numero_documento) > 12:
            return HttpResponse("El número de documento debe tener entre 6 y 12 dígitos", status=400)
        if Usuarios.objects.filter(numerodocumento=numero_documento).exists():
            return HttpResponse("El número de documento ya está registrado", status=400)

        # 🔹 5. Validar contraseñas
        if clave1 != clave2:
            return HttpResponse("Las contraseñas no coinciden", status=400)
        if len(clave1) < 8 or not re.search(r'[A-Z]', clave1) or not re.search(r'[0-9]', clave1):
            return HttpResponse("La contraseña debe tener mínimo 8 caracteres, incluir una mayúscula y un número", status=400)

        # 🔹 6. Validar tipo de documento
        try:
            tipo_documento_obj = TipoDocumentos.objects.get(id=tipo_documento_id)
        except TipoDocumentos.DoesNotExist:
            return HttpResponse("Tipo de documento inválido", status=400)

        # ✅ Crear usuario si todo está correcto
        Usuarios.objects.create(
            username=nombre_usuario,
            nombres=nombres,
            apellidos=apellidos,
            correo=correo,
            idtipodocumento=tipo_documento_obj,
            numerodocumento=numero_documento,
            rol=rol,
            clave=clave1,  # ⚠️ lo ideal sería encriptar con make_password
            estado=estado
        )

        return redirect('registro_exitoso')

    return HttpResponse("Método no permitido", status=405)
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

# En views.py - modificar la función EliminarVacuno
@login_requerido
def EliminarVacuno(request, id):
    vacuno = get_object_or_404(Ganado, id=id)
    # En lugar de eliminar, marcamos como inactivo
    vacuno.activo = False
    vacuno.save()
    return JsonResponse({'success': True})

# Nueva función para reactivar vaca
@login_requerido
def ReactivarVaca(request, id):
    vacuno = get_object_or_404(Ganado, id=id)
    vacuno.activo = True
    vacuno.save()
    return JsonResponse({'success': True})

# Modificar VacasInactivas para filtrar solo las inactivas
@login_requerido
def VacasInactivas(request):
    vacas_inactivas = Ganado.objects.filter(activo=False)
    paginator = Paginator(vacas_inactivas, 9)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    return render(request, 'Ganado/Inactivas.html', {
        'page_obj': page_obj,
        'total_inactivas': vacas_inactivas.count()
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
    return JsonResponse({'success': False, 'error': 'Método no permitido'})
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
            foto=foto,
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
@login_requerido
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
            'foto': cultivo.foto.url if cultivo.foto else '',
        })
    except Cultivo.DoesNotExist:
        return JsonResponse({'error': 'Cultivo no encontrado'}, status=404)
  
def obtener_fertilizaciones(request, cultivo_id):
    cultivo = Cultivo.objects.get(id=cultivo_id)

    fertilizaciones = Fertilizacion.objects.filter(cultivo_id=cultivo_id).values(
        'fecha', 'fertilizante', 'observaciones', 'tipo', 'dosis'  # ← se agregan
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
        tipo = request.POST.get('tipo')
        dosis = request.POST.get('dosis')
        observaciones = request.POST.get('observaciones', '')

        # Validaciones básicas
        if not (fecha and fertilizante and tipo and dosis):
            return HttpResponseBadRequest('Faltan campos obligatorios.')

        try:
            cultivo = Cultivo.objects.get(id=cultivo_id)
            fecha_fert = datetime.strptime(fecha, '%Y-%m-%d').date()

            if fecha_fert < cultivo.fecha_siembra:
                return HttpResponseBadRequest('La fecha de fertilización no puede ser anterior a la siembra.')
            if fecha_fert > cultivo.fecha_cosecha:
                return HttpResponseBadRequest('La fecha de fertilización no puede ser posterior a la cosecha.')

            Fertilizacion.objects.create(
                cultivo=cultivo,
                fecha=fecha_fert,
                fertilizante=fertilizante,
                tipo=tipo,
                dosis=dosis,
                observaciones=observaciones
            )

            return JsonResponse({'message': 'Fertilización registrada con éxito'})

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

def obtener_notificaciones(request):
    hoy = date.today()
    notificaciones = []

    cultivos = Cultivo.objects.all()

    for cultivo in cultivos:
        # Notificación por cosecha próxima
        if 0 <= (cultivo.fecha_cosecha - hoy).days <= 3:
            notificaciones.append({
                "tipo": "cosecha",
                "mensaje": f' El cultivo "{cultivo.nombre}" está cerca de su fecha de cosecha ({cultivo.fecha_cosecha})'
            })

        # Notificación por inactividad
        tiene_fertilizaciones = Fertilizacion.objects.filter(cultivo=cultivo).exists()
        if not tiene_fertilizaciones:
            notificaciones.append({
                "tipo": "inactividad",
                "mensaje": f'El cultivo "{cultivo.nombre}" nunca ha sido fertilizado.'
            })

    return JsonResponse({"notificaciones": notificaciones})

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
#end region

# region notificaciones

def SistemaNotficacionesGmail(request):
    pass


# endregion