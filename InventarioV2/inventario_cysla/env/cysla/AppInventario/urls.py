from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
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
    
    #region cultivo
    path('Cultivo/Tabla/', views.TablaCultivo, name="TablaCultivo"),
    path('Cultivo/obtener/<int:id>/', views.obtener_cultivo, name='obtener_cultivo'),
    path('Cultivo/editar/', views.editar_cultivo, name='editar_cultivo'),
    path('Cultivo/eliminar/', views.eliminar_cultivo, name='eliminar_cultivo'),
    path('Cultivo/api/tipos/', views.obtener_tipoCultivos, name='obtener_tipos'),
    path('Cultivo/api/tipos/agregar/', views.agregar_tipoCultivo, name='agregar_tipo'),
    path('Cultivo/api/tipos/eliminar/<int:id>/', views.eliminar_tipoCultivo, name='eliminar_tipo'),
    #endregion
    
    #Region Parcela
    path('agregar-parcela/', views.agregar_parcela, name='agregar_parcela'),
    path('listar-parcelas/', views.listar_parcelas, name='listar_parcelas'),
    path('parcelas/<int:registro_id>/cambiar-estado/', views.activar, name='cambiar_estado_parcela'),
    path('parcelas/<int:registro_id>/cambiar/', views.Desactivar, name='cambiar_estado_parcela'),
    #endRegion

    #Region Razas
    path('ListaRazas/', views.ListaRazas, name='ListaRazas'),
    path('AgregarRaza/', views.AgregarRaza, name='AgregarRaza'),
    #end Region
    
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)