from django.utils import timezone
from AppInventario.models import Cultivo, Usuarios, NotificacionCultivo
from django.core.mail import send_mail
from django.conf import settings

def enviar_notificaciones_cultivos():
    hoy = timezone.now().date()
    usuarios = Usuarios.objects.filter(estado='activo')
    # Obtener TODOS los cultivos (sin filtrar por usuario)
    cultivos = Cultivo.objects.all()

    for cultivo in cultivos:
        # Notificación de cosecha (3 días antes)
        if cultivo.fecha_cosecha:
            dias_restantes = (cultivo.fecha_cosecha - hoy).days
            if dias_restantes == 3:
                mensaje = f"⚠️ Cosecha próxima: '{cultivo.nombre}' se cosechará en {dias_restantes} días ({cultivo.fecha_cosecha})."
                _crear_notificaciones_para_todos(cultivo, usuarios, mensaje, "cosecha")

        # Lógica de fertilización
        ultima_fertilizacion = cultivo.fertilizaciones.order_by('-fecha').first()
        
        if not ultima_fertilizacion:
            mensaje = f"🔴 Alerta: '{cultivo.nombre}' no ha sido fertilizado."
            _crear_notificaciones_para_todos(cultivo, usuarios, mensaje, "sin_fertilizar")
        elif (hoy - ultima_fertilizacion.fecha).days >= 30:
            mensaje = f"🟡 Recordatorio: '{cultivo.nombre}' necesita nueva fertilización (última: {ultima_fertilizacion.fecha})."
            _crear_notificaciones_para_todos(cultivo, usuarios, mensaje, "re_fertilizar")

def _crear_notificaciones_para_todos(cultivo, usuarios, mensaje, tipo):
    for usuario in usuarios:
        # Evitar duplicados en el mismo día
        if NotificacionCultivo.objects.filter(
            cultivo=cultivo,
            usuario=usuario,
            tipo=tipo,
            fecha__date=timezone.now().date()
        ).exists():
            continue

        # Crear notificación
        notificacion = NotificacionCultivo.objects.create(
            cultivo=cultivo,
            usuario=usuario,
            mensaje=mensaje,
            tipo=tipo
        )

        # Enviar email
        if usuario.correo:
            try:
                send_mail(
                    subject=f"Notificación de Cultivo - {cultivo.nombre}",
                    message=mensaje,
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[usuario.correo],
                    fail_silently=False
                )
                notificacion.leido = True
                notificacion.save()
            except Exception as e:
                print(f"Error enviando email: {str(e)}")