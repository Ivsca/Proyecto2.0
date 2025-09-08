from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from .models import Ganado, TablaRazas
import traceback
import openpyxl
from openpyxl.utils import get_column_letter
import re

def PlantillaTablas(request):
    razas = TablaRazas.objects.all()
    campos_ganado = [field.name for field in Ganado._meta.fields if field.name not in ['id', 'foto']]
    return render(request, 'Ganado/tablas.html', {
        'razas': razas,
        'campos_disponibles': campos_ganado
    })

def ConsultarVacunos(request):
    try:
        # Validar y obtener parámetros
        limit = int(request.GET.get('limit', 10))
        offset = int(request.GET.get('offset', 0))
        fields = request.GET.get('fields', '')
        selected_fields = [f for f in fields.split(',') if f]
        all_fields = [f.name for f in Ganado._meta.fields]
        
        # Validar campos
        valid_fields = [f for f in selected_fields if f in all_fields]
        if not valid_fields:
            return JsonResponse({'success': True, 'vacunos': [], 'total': 0})

        queryset = Ganado.objects.all()

        # Filtro por raza
        filter_raza = request.GET.get('filter_raza')
        if filter_raza:
            queryset = queryset.filter(razas=filter_raza)

        # Orden dinámico
        order_fields = []
        for key, value in request.GET.items():
            if key.startswith('sort_') and value in ['asc', 'desc']:
                field = key[5:]
                if field in valid_fields:
                    order_fields.append(f'-{field}' if value == 'desc' else field)
        if order_fields:
            queryset = queryset.order_by(*order_fields)

        total = queryset.count()
        vacunos = queryset.only(*valid_fields)[offset:offset+limit]

        data = []
        for vacuno in vacunos:
            item = {}
            for field in valid_fields:
                value = getattr(vacuno, field, '')
                # ForeignKey: mostrar id
                if hasattr(value, 'id'):
                    value = value.id
                item[field] = value
            data.append(item)

        return JsonResponse({'success': True, 'vacunos': data, 'total': total})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)

def ExportarExcel(request):
    try:
        # Validar nombre de archivo
        filename = request.GET.get('filename', 'ganado')
        if not filename:
            return HttpResponse("El nombre del archivo es requerido", status=400)
        
        # Validar caracteres en el nombre del archivo
        if re.search(r'[<>:"/\\|?*]', filename):
            return HttpResponse("El nombre del archivo contiene caracteres no válidos", status=400)
        
        fields = request.GET.get('fields', '')
        selected_fields = [f for f in fields.split(',') if f]
        all_fields = [f.name for f in Ganado._meta.fields]
        valid_fields = [f for f in selected_fields if f in all_fields]
        if not valid_fields:
            return HttpResponse("No hay columnas válidas", status=400)
        
        queryset = Ganado.objects.all()
        filter_raza = request.GET.get('filter_raza')
        if filter_raza:
            queryset = queryset.filter(razas=filter_raza)
        
        # Aplicar ordenamiento si existe
        order_fields = []
        for key, value in request.GET.items():
            if key.startswith('sort_') and value in ['asc', 'desc']:
                field = key[5:]
                if field in valid_fields:
                    order_fields.append(f'-{field}' if value == 'desc' else field)
        if order_fields:
            queryset = queryset.order_by(*order_fields)
            
        vacunos = queryset.only(*valid_fields)

        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Ganado"
        
        # Encabezados
        for idx, field in enumerate(valid_fields, 1):
            ws.cell(row=1, column=idx, value=field)
        
        # Datos
        for row_idx, vacuno in enumerate(vacunos, 2):
            for col_idx, field in enumerate(valid_fields, 1):
                value = getattr(vacuno, field, '')
                if hasattr(value, 'id'):
                    value = value.id
                ws.cell(row=row_idx, column=col_idx, value=value)
        
        # Ajustar ancho
        for col in ws.columns:
            max_length = max(len(str(cell.value)) if cell.value else 0 for cell in col)
            ws.column_dimensions[get_column_letter(col[0].column)].width = max_length + 2

        from io import BytesIO
        output = BytesIO()
        wb.save(output)
        output.seek(0)
        response = HttpResponse(output, content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = f'attachment; filename={filename}.xlsx'
        return response
    except Exception as e:
        return HttpResponse(f"Error: {str(e)}", status=500)

def PlantillaGraficas(request):
    return render(request, 'Ganado/graficas.html')