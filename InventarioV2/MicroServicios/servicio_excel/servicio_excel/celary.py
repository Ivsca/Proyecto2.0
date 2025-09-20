# service_excel/celery.py
import os
from celery import Celery

# Establecer el módulo de configuración de Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'service_excel.settings')

# Crear la instancia de Celery
app = Celery('service_excel')

# Configurar Celery usando las configuraciones de Django
app.config_from_object('django.conf:settings', namespace='CELERY')

# Auto-descubrir tareas en todas las apps INSTALLED_APPS
app.autodiscover_tasks()