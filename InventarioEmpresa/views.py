from django.shortcuts import render, redirect, get_object_or_404
from .models import Cultivo, TipoCultivo, Ganado, TipoParcela,TipoRaza
from django.http import HttpResponse, JsonResponse
from django.core.files.storage import FileSystemStorage
from django.utils.dateparse import parse_date
from django.conf import settings
import os

#---------------------------------------------------Normalizacion de codigo---------------------------------------------------------------
#  para las funciones todas debes estar escritas de la misma forma es decir: la primera 
#  letra de cada palabra en mayuscula y el resto en minuscula ejemplo: def Nombre_funcion(parametro):, 
# def Camisas_pablo(request):, def Camisas_pablo(request), etc.

# para las variables todas deben estar escritas en minuscula y separadas por _ ejemplo: nombre_usuario, apellido_usuario, etc.

# para los nombres de las tablas de models debes usar mayuscula en la primera letra de cada palabra. ejemplo: NombreTabla, etc.
#-----------------------------------------------------------------------------------------------------------------------------------------

def Home(request):
    return render(request, 'index.html')

# region Logueo
def RegisterUser(request):
    return render(request, 'Logueo/register_user.html')

def LoginUser(request):
    return render(request, 'Logueo/login_user.html')


# endregion

# region Solicitudes de Acceso
def Solicitudes(request):
    return render(request, 'CrudSolicitudesAcceso/listado.html')
# endregion

# region cultivos
def Cultivos(request):
    razas =  Ganado.objects.all()
    parcelas = TipoParcela.objects.all()
    cultivos = Cultivo.objects.all()
    tipo_Cultivo= TipoCultivo.objects.all()
    return render(request, 'CrudCultivos/Cultivos.html',{
        'cultivos':cultivos,
        'tipo_Cultivo':tipo_Cultivo,
        'parcelas':parcelas,
        'razas':razas
    })
# endregion

# region ganado
def GanadoList(request):
    ganado = Ganado.objects.all()
    parcelas = TipoParcela.objects.all()
    razas = TipoRaza.objects.all()
    return render(request, 'CrudGanado/ganado.html', {
        'ganado': ganado,
        'parcelas': parcelas,
        'razas': razas
    })


def AgregarVacuno(request):
    fs = FileSystemStorage(location=os.path.join(settings.MEDIA_ROOT, 'ImagenesGanado'))
    if request.method == 'POST':
        codigo = request.POST.get('codigo')
        imagen_vacuno = request.FILES.get('ImagenVacuno')
        crias = request.POST.get('crias')
        codigo_papa = request.POST.get('CodigoPapa')
        codigo_mama = request.POST.get('CodigoMama')
        raza = request.POST.get('raza')
        edad = request.POST.get('edad')
        proposito = request.POST.get('proposito')
        origen = request.POST.get('origen')
        estado = request.POST.get('estado')
        dia_vacunada = request.POST.get('Dia_vacunada')
        dia_caduca_vacunada = request.POST.get('Dia_caduca_vacunada')
        parcela = request.POST.get('parcela')
        alimentacion = request.POST.get('alimentacion')
        enfermedades = request.POST.get('enfermedades')
        vacunas = request.POST.get('vacunas')

        dia_vacunada = parse_date(dia_vacunada)
        dia_caduca_vacunada = parse_date(dia_caduca_vacunada)

        image_url = None
        if imagen_vacuno:
            import uuid
            extension = os.path.splitext(imagen_vacuno.name)[1]
            unique_filename = f"{uuid.uuid4().hex}{extension}"
            
            filename = fs.save(unique_filename, imagen_vacuno)
            image_url = fs.url(filename)

        ganado = Ganado(
            codigo=codigo,
            ImagenVacuno=image_url,
            crias=crias,
            CodigoPapa=codigo_papa,
            CodigoMama=codigo_mama,
            raza_id=raza,
            edad=edad,
            proposito=proposito,
            estado=estado,
            vacunas=vacunas,
            Dia_vacunada=dia_vacunada,
            Dia_caduca_vacunada=dia_caduca_vacunada,
            parcela_id=parcela,
            alimentacion=alimentacion,
            enfermedades=enfermedades,
            origen=origen
        )
        
        ganado.save()
        return redirect('/ganado/list/')


def VerGanado(request, id_ganado, codigo, crias, CodigoPapa, CodigoMama, raza, edad, proposito, estado, vacunas, Dia_vacunada, Dia_caduca_vacunada, parcela, alimentacion, enfermedades, origen):
    ganado = get_object_or_404(Ganado, id=id_ganado)

    data = {
        'codigo': ganado.codigo,
        'crias': ganado.crias,
        'CodigoPapa': ganado.CodigoPapa,
        'CodigoMama': ganado.CodigoMama,
        'raza': ganado.raza.nombre,
        'edad': ganado.edad,
        'proposito': ganado.proposito,
        'estado': ganado.estado,
        'vacunas': ganado.vacunas,
        'Dia_vacunada': ganado.Dia_vacunada.strftime('%Y-%m-%d'),
        'Dia_caduca_vacunada': ganado.Dia_caduca_vacunada.strftime('%Y-%m-%d'),
        'parcela': ganado.parcela.nombre,
        'alimentacion': ganado.alimentacion,
        'enfermedades': ganado.enfermedades,
        'origen': ganado.origen,
    }
    return JsonResponse(data)


def ActualizarVacuno(request, id_vacuno):
    vacuno = get_object_or_404(Ganado, id=id_vacuno)
    fs = FileSystemStorage(location=os.path.join(settings.MEDIA_ROOT, 'ImagenesGanado'))

    if request.method == 'POST':
        codigo = request.POST.get('codigo')
        imagen_vacuno = request.FILES.get('ImagenVacuno')
        crias = request.POST.get('crias')
        codigo_papa = request.POST.get('CodigoPapa')
        codigo_mama = request.POST.get('CodigoMama')
        raza = request.POST.get('raza')
        edad = request.POST.get('edad')
        proposito = request.POST.get('proposito')
        origen = request.POST.get('origen')
        estado = request.POST.get('estado')
        dia_vacunada = request.POST.get('Dia_vacunada')
        dia_caduca_vacunada = request.POST.get('Dia_caduca_vacunada')
        parcela = request.POST.get('parcela')
        alimentacion = request.POST.get('alimentacion')
        enfermedades = request.POST.get('enfermedades')
        vacunas = request.POST.get('vacunas')

        dia_vacunada = parse_date(dia_vacunada) if dia_vacunada else None
        dia_caduca_vacunada = parse_date(dia_caduca_vacunada) if dia_caduca_vacunada else None

        if imagen_vacuno:
            if vacuno.ImagenVacuno:
                old_file = os.path.join(settings.MEDIA_ROOT, str(vacuno.ImagenVacuno))
                if os.path.isfile(old_file):
                    os.remove(old_file)

            filename = fs.save(imagen_vacuno.name, imagen_vacuno)
            image_url = fs.url(filename)
            vacuno.ImagenVacuno = image_url

        vacuno.codigo = codigo
        vacuno.crias = int(crias) if crias else 0
        vacuno.CodigoPapa = codigo_papa
        vacuno.CodigoMama = codigo_mama
        vacuno.raza_id = int(raza) if raza else None
        vacuno.edad = int(edad) if edad else None
        vacuno.proposito = proposito
        vacuno.origen = origen
        vacuno.estado = estado
        vacuno.Dia_vacunada = dia_vacunada
        vacuno.Dia_caduca_vacunada = dia_caduca_vacunada
        vacuno.parcela_id = int(parcela) if parcela else None
        vacuno.alimentacion = alimentacion
        vacuno.enfermedades = enfermedades
        vacuno.vacunas = vacunas

        try:
            vacuno.save()
        except Exception:
            pass

        return redirect('/ganado/list/')
    
    context = {'vacuno': vacuno}
    return render(request, 'editar_vacuno.html', context)
    
def BorrarVacuno(request, id_vacuno):
    vacuno = Ganado.objects.get(id=id_vacuno)
    
    if vacuno.ImagenVacuno:
        ruta_imagen = os.path.join(settings.MEDIA_ROOT, str(vacuno.ImagenVacuno))
        if os.path.isfile(ruta_imagen):
            os.remove(ruta_imagen)
    
    vacuno.delete()
    
    return redirect('/ganado/list/')
# endregion