FROM python:3.12-alpine

WORKDIR /app

# Instalar dependencias CORRECTAS para MySQL
RUN apk add --no-cache \
    gcc \
    musl-dev \
    python3-dev \
    mariadb-dev \
    build-base \
    pkgconfig \
    curl \
    mariadb-connector-c-dev

# Instalar dependencias Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar proyecto
COPY . .

# Colectar estáticos Y aplicar migraciones
RUN python manage.py collectstatic --noinput

# Exponer puerto
EXPOSE 8000

# Comando de inicio que incluye migraciones
CMD sh -c "python manage.py migrate --noinput && gunicorn cysla.wsgi:application --bind 0.0.0.0:8000"