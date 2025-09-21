# Dockerfile
FROM python:3.12-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema necesarias para compilar y para mysqlclient
RUN apk add --no-cache \
    gcc \
    musl-dev \
    python3-dev \
    libffi-dev \
    mariadb-dev \
    build-base \
    pkgconfig \
    curl

# Copiar requirements primero (mejor uso de cache de Docker)
COPY requirements.txt .

# Instalar dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto del proyecto
COPY . .

# Colectar archivos estáticos en /app/staticfiles
RUN python manage.py collectstatic --noinput

# Exponer el puerto (opcional pero recomendado)
EXPOSE 8000

# Iniciar Gunicorn (cambia "cysla" si tu proyecto principal tiene otro nombre en wsgi.py)
CMD ["gunicorn", "cysla.wsgi:application", "--bind", "0.0.0.0:8000"]
