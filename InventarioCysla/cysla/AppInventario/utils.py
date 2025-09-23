from django.core.mail import send_mail
from django.conf import settings

def send_reset_email(email, code):
    subject = "Código para recuperar tu contraseña"
    message = f"Tu código de recuperación es: {code} (válido por 15 minutos)"
    html_message = f"<p>Tu código de recuperación es: <strong>{code}</strong></p><p>Válido por 15 minutos.</p>"
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email], html_message=html_message)
