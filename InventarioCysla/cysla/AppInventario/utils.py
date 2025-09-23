# AppInventario/utils.py
from django.core.mail import send_mail
from django.conf import settings

def send_reset_email(email, code):
    subject = 'Código de recuperación de contraseña'
    message = f'''
    Hola,
    
    Has solicitado restablecer tu contraseña. 
    Tu código de verificación es: {code}
    
    Este código expirará en 15 minutos.
    
    Si no solicitaste este cambio, ignora este mensaje.
    
    Saludos,
    Equipo de soporte
    '''
    
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [email],
        fail_silently=False,
    )