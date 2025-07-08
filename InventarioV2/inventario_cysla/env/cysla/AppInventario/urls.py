from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # region Home
    path("", views.Home, name="Home"),
    # endregion

    # region Logueo
    path('Logueo/Plantilla/', views.plantilla_logue, name='PlantillaLogueo'),
    path('Logueo/Login/', views.LoginUser, name='LoginUser'),
    path('Logueo/Register/', views.RegisterUser, name='RegisterUser'),
    path('Logueo/creado/', views.registro_exitoso, name='registro_exitoso'),
    path('Logueo/nocreado/', views.nocreada, name='nocreada'),
    path('Logueo/Logout/', views.logout_view, name='LogoutUser'),
    # endregion

    # region Solicitudes de acceso
    path('Logueo/TablaSolicitudesUser/', views.TablaSolicitudesUsuarios, name='TablaSolicitudesUsuarios'),
    path('Logueo/TablaSolicitudesUser/aceptada/<int:id_solicitud>', views.SolicitudAceptada, name='SolicitudAceptada'),
    path('Logueo/TablaSolicitudesUser/Eliminar/<int:id_solicitud>', views.EliminarSolicitud, name='EliminarSolicitud'),
    path('Logueo/TablaUsuarios/', views.TablaUsuarios, name='TablaUsuarios'),
    # endregion

    # region Ganado
    path('Ganado/Tabla/', views.TablaGanado, name="TablaGanado"),
    path('Ganado/Tabla/Eliminar/vacuno/<int:id>', views.EliminarVacuno, name="EliminarVacuno"),
    path('Ganado/BuscarCodigo/', views.buscar_codigo_ganado, name='buscar_codigo_ganado'),
    path('registrar_ganado/', views.registrar_ganado, name='registrar_ganado'),
    path('actualizar_ganado/<int:id>/', views.actualizar_ganado, name='actualizar_ganado'),
    path('Ganado/api/obtener/<int:id>/', views.obtener_ganado, name='obtener_ganado'),
    # endregion

    #region cultivo
    path('Cultivo/Tabla/', views.TablaCultivo, name="TablaCultivo"),
    path('Cultivo/obtener/<int:id>/', views.obtener_cultivo, name='obtener_cultivo'),
    path('Cultivo/editar/', views.editar_cultivo, name='editar_cultivo'),
    path('Cultivo/eliminar/', views.eliminar_cultivo, name='eliminar_cultivo'),
    path('Cultivo/api/tipos/', views.obtener_tipoCultivos, name='obtener_tipos'),
    path('Cultivo/api/tipos/agregar/', views.agregar_tipoCultivo, name='agregar_tipo'),
    path('Cultivo/api/tipos/eliminar/<int:id>/', views.eliminar_tipoCultivo, name='eliminar_tipo'),
    path('Cultivo/fertilizaciones/<int:cultivo_id>/', views.obtener_fertilizaciones),
    path('Cultivo/fertilizar/<int:cultivo_id>/', views.agregar_fertilizacion),
    path('notificaciones/', views.obtener_notificaciones, name='obtener_notificaciones'),

    # endregion

    # API tipos cultivo
    path('Cultivo/api/tipos/', views.obtener_tipoCultivos, name='obtener_tipos'),
    path('Cultivo/api/tipos/agregar/', views.agregar_tipoCultivo, name='agregar_tipo'),
    path('Cultivo/api/tipos/eliminar/<int:id>/', views.eliminar_tipoCultivo, name='eliminar_tipo'),
    #endregion
    
    #Region Parcela

    # Fertilizaciones
    path('Cultivo/fertilizaciones/<int:cultivo_id>/', views.obtener_fertilizaciones),
    path('Cultivo/fertilizar/<int:cultivo_id>/', views.agregar_fertilizacion),

    # Notificaciones
    path('notificaciones/', views.obtener_notificaciones, name='obtener_notificaciones'),
    # endregion

    # region Parcela
    path('agregar-parcela/', views.agregar_parcela, name='agregar_parcela'),
    path('listar-parcelas/', views.listar_parcelas, name='listar_parcelas'),
    path('parcelas/<int:registro_id>/cambiar-estado/', views.activar, name='cambiar_estado_parcela'),
    path('parcelas/<int:registro_id>/cambiar/', views.Desactivar, name='cambiar_estado_parcela'),
    # endregion

    # region Razas
    path('ListaRazas/', views.ListaRazas, name='ListaRazas'),
    path('AgregarRaza/', views.AgregarRaza, name='AgregarRaza'),
    # endregion
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
