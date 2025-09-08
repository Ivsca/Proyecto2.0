from django.urls import path
from . import views

urlpatterns = [
    path("", views.PlantillaTablas, name="PlantillaTablas"),
    path("consultar-vacunos/", views.ConsultarVacunos, name="ConsultarVacunos"),
    path("exportar-excel/", views.ExportarExcel, name="ExportarExcel"),
    path("graficas/", views.PlantillaGraficas, name="PlantillaGraficas"),
]