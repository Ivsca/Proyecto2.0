FROM python:3.12-slim

WORKDIR /app

# Instalar dependencias del sistema necesarias
RUN apt-get update && apt-get install -y \
    gcc \
    pkg-config \
    default-libmysqlclient-dev \
    build-essential \
    netcat-openbsd \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements primero para aprovechar la caché de Docker
COPY requirements.txt .

# Instalar dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto de los archivos
COPY . .

# Hacer ejecutable wait-for.sh si existe
RUN chmod +x wait-for.sh || true

# Ejecutar collectstatic sin pedir confirmación
# Ejecutar collectstatic sin pedir confirmación
RUN python manage.py collectstatic --noinput

# Arrancar Django con Gunicorn en Render
CMD ["gunicorn", "cysla.wsgi:application", "--bind", "0.0.0.0:8000"]

