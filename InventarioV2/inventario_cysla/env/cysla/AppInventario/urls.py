from django.urls import path
from . import views
urlpatterns = [
    path("",views.Home,name="Home"),
    # region logueo
    path('Logueo/Plantilla/',views.plantilla_logue, name='PlantillaLogueo'),
    path('Logueo/Login/',views.LoginUser, name='LoginUser'),
    path('Logueo/Register/',views.RegisterUser, name='RegisterUser'),
    # region solicitudes de acceso
    path('Logueo/TablaSolicitudesUser/',views.TablaSolicitudesUsuarios, name='TablaSolicitudesUsuarios'),
    path('Logueo/TablaSolicitudesUser/aceptada/<int:id_solicitud>', views.SolicitudAceptada, name='SolicitudAceptada'),

    path('Logueo/TablaSolicitudesUser/Eliminar/<int:id_solicitud>',views.EliminarSolicitud, name='EliminarSolicitud'),
    # endregion
    path('Logueo/TablaUsuarios/',views.TablaUsuarios, name='TablaUsuarios'),
    # endregion
    # region ganado
    path('Ganado/Tabla/',views.TablaGanado, name="TablaGanado"),
    path('Ganado/Tabla/Eliminar/vacuno/<int:id>',views.EliminarVacuno, name="EliminarVacuno"),
    # endregion
]