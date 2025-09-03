from django.urls import path
from . import views

urlpatterns = [
    path("", views.PlantillaTablas, name="PlantillaTablas"),
    path("consultar-vacunos/", views.ConsultarVacunos, name="ConsultarVacunos"),  # Cambiado para coincidir con la llamada AJAX
    path("graficas/", views.PlantillaGraficas, name="PlantillaGraficas"),
]