# Dockerfile
FROM python:3.12-alpine

WORKDIR /app

# Instalar dependencias del sistema
RUN apk add --no-cache gcc musl-dev python3-dev libffi-dev mariadb-dev build-base pkgconfig

# Copiar requirements e instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto del proyecto
COPY . .

# Colectar estáticos
RUN python manage.py collectstatic --noinput

# Arrancar gunicorn
CMD ["gunicorn", "proyecto.wsgi:application", "--bind", "0.0.0.0:8000"]
