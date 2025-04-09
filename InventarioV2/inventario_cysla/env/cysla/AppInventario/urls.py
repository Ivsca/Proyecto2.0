from django.urls import path
from . import views
urlpatterns = [
    path("",views.Home,name="Home"),
    # region logueo
    path('Logueo/Plantilla/',views.plantilla_logue, name='PlantillaLogueo'),
    path('Logueo/Login/',views.LoginUser, name='LoginUser'),
    path('Logueo/Register/',views.RegisterUser, name='RegisterUser'),
    path('Logueo/TablaSolicitudesUser/',views.TablaSolicitudesUsuarios, name='TablaSolicitudesUser'),
    path('Logueo/TablaUsuarios/',views.TablaUsuarios, name='TablaUsuarios'),
    # endregion
]