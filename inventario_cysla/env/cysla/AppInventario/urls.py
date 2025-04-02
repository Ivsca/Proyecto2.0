from django.urls import path
from . import views
urlpatterns = [
    path("",views.Home,name="Home"),
    # region logueo
    path('Logueo/Plantilla/',views.plantilla_logue, name='Plantilla_logueo')
    # endregion
]