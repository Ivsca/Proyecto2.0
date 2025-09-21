FROM python:3.12-slim

WORKDIR /app

# Dependencias del sistema necesarias
RUN apt-get update && apt-get install -y \
    gcc \
    pkg-config \
    default-libmysqlclient-dev \
    build-essential \
    libmariadb-dev \
    netcat-openbsd \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements.txt e instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar todo el proyecto
COPY . .

# Hacer ejecutable wait-for.sh si existe
RUN chmod +x wait-for.sh || true

# Ejecutar collectstatic (para producción en Render)
RUN python manage.py collectstatic --noinput

# Exponer puerto
EXPOSE 8000

# Comando por defecto → Gunicorn en producción
CMD ["gunicorn", "cysla.wsgi:application", "--bind", "0.0.0.0:8000"]
