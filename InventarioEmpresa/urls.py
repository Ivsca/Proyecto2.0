from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path('', views.Home),
# region Logueo
    path('Logueo/login_user/', views.LoginUser),
    path('Logueo/Register_user/', views.RegisterUser),
# endregion
# region Solicitudes de Acceso
    path('solicitudes/list/', views.Solicitudes),
# endregion
# region Cultivos
    path('cultivos/list/', views.Cultivos),
# endregion
# region Ganado
    path('ganado/list/', views.GanadoList),
    path('ganado/agregar/', views.AgregarVacuno, name='agregar_vacuno'),
    path('ganado/ver/', views.VerGanado),
    path('ganado/actualizar/<str:id_vacuno>/', views.ActualizarVacuno, name='actualizar_vacuno'),
    path('ganado/borrar/<str:id_vacuno>/', views.BorrarVacuno),
# endregion
]
