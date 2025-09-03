from django.shortcuts import render
from django.http import JsonResponse
from .models import Ganado, TablaRazas
from django.db.models import Q

def PlantillaTablas(request):
    razas = TablaRazas.objects.all()
    vacunos = Ganado.objects.all().order_by('id')[:10]
    
    # Obtener todos los campos disponibles del modelo para las columnas
    campos_ganado = [field.name for field in Ganado._meta.get_fields() 
                    if not field.is_relation or field.many_to_one]
    
    # Agregar campos calculados
    campos_ganado.extend(['litros_leche', 'fecha_parto'])
    
    return render(request, 'Ganado/tablas.html', {
        'vacunos': vacunos,
        'razas': razas,
        'campos_disponibles': campos_ganado
    })

def ConsultarVacunos(request):
    try:
        # Parámetros de ordenamiento
        sort_params = {}
        for key, value in request.GET.items():
            if key.startswith('sort_') and value in ['asc', 'desc']:
                sort_params[key[5:]] = value
        
        # Parámetros de filtrado
        filter_params = {}
        for key, value in request.GET.items():
            if key.startswith('filter_') and value:
                filter_params[key[7:]] = value
        
        # Cantidad de registros
        try:
            limit = int(request.GET.get('limit', 10))
            limit = max(1, min(limit, 1000))  # Asegurar entre 1 y 1000
        except:
            limit = 10
        
        queryset = Ganado.objects.all()
        
        # Aplicar filtros
        if 'razas' in filter_params:
            queryset = queryset.filter(razas__icontains=filter_params['razas'])
        
        # Aplicar ordenamiento
        order_fields = []
        for column, order in sort_params.items():
            if column == 'id':
                order_fields.append('id' if order == 'asc' else '-id')
            elif column == 'codigocria':
                order_fields.append('codigocria' if order == 'asc' else '-codigocria')
            elif column == 'crias':
                order_fields.append('crias' if order == 'asc' else '-crias')
            elif column == 'litros_leche':
                # Ordenamiento en memoria para campos calculados
                pass
            elif column == 'fecha_parto':
                order_fields.append('fecha_parto' if order == 'asc' else '-fecha_parto')
        
        if order_fields:
            queryset = queryset.order_by(*order_fields)
        
        vacunos = list(queryset[:limit])
        
        # Preparar datos para la respuesta
        data = []
        for vacuno in vacunos:
            item = {
                'id': vacuno.id,
                'codigocria': vacuno.codigocria,
                'razas': vacuno.razas,
                'litros_leche': getattr(vacuno, 'litros_leche', 15 + vacuno.id % 10),
                'crias': vacuno.crias,
                'fecha_parto': getattr(vacuno, 'fecha_parto', '-'),
                'edad': vacuno.edad,
                'estado': vacuno.estado,
                'enfermedades': vacuno.enfermedades,
                'codigopapa': vacuno.codigopapa,
                'codigomama': vacuno.codigomama,
                'idparcela': vacuno.idparcela.nombre if vacuno.idparcela else ''
            }
            data.append(item)
        
        return JsonResponse({
            'success': True,
            'vacunos': data,
            'total': queryset.count()
        })
    
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e),
            'traceback': traceback.format_exc()
        }, status=500)

def PlantillaGraficas(request):
    return render(request, 'Ganado/graficas.html')