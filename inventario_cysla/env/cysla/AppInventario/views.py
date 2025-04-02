from django.shortcuts import render,redirect
from django.http import HttpResponse
from .models import TablaRazas


# Create your views here.

# region Home
def Home(request):
    return render(request,'Home.html')
# endregion

# region Logueo

def plantilla_logue(request):
    return render(request,'Logueo.html')

# region Register
# def register_user(request):
#     return redirect(Home)
# endregion 
# region Login
# def Login_user(request):
#     return redirect(Home)
# endregion 

# endregion

# def info_razas(request):
#     razas = TablaRazas.objects.all()
#     return HttpResponse("razas")