from django.core.mail import send_mail
from django.utils import timezone
from datetime import timedelta
from .models import Cultivo, Usuarios

def enviar_notificaciones_cultivos():
    hoy = timezone.now().date()

    # Recorremos todos los usuarios registrados
    usuarios = Usuarios.objects.all()
    for usuario in usuarios:
        mensajes = []

        # Cultivos de este usuario
        cultivos = Cultivo.objects.filter(usuario=usuario)

        for cultivo in cultivos:
            # 1. Notificación de cosecha próxima (3 días antes)
            if cultivo.fecha_cosecha and cultivo.fecha_cosecha - timedelta(days=3) == hoy:
                mensajes.append(f"El cultivo '{cultivo.nombre}' estará listo para cosechar el {cultivo.fecha_cosecha}.")

            # 2. Notificación si no se ha fertilizado
            if not cultivo.fertilizaciones.exists():
                mensajes.append(f"El cultivo '{cultivo.nombre}' aún no ha sido fertilizado.")

            # 3. Recordatorio de fertilización repetida
            ultima_fertilizacion = cultivo.fertilizaciones.order_by('-fecha').first()
            if ultima_fertilizacion and ultima_fertilizacion.fecha < hoy - timedelta(days=30):
                mensajes.append(f"Han pasado más de 30 días desde la última fertilización de '{cultivo.nombre}'.")

        # Si hay mensajes, enviar el correo al usuario
        if mensajes:
            send_mail(
                'Notificaciones de Cultivos - Inventarios C&SLA',
                '\n'.join(mensajes),
                'notificaciones@tuservidor.com',  # Cambia por tu correo remitente
                [usuario.email],  # Correo del usuario
                fail_silently=False,
            )
