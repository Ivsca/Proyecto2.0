# Usa Python Alpine como base
FROM python:3.13.5-alpine3.22

# Establece el directorio de trabajo
WORKDIR /app

# Instala dependencias del sistema necesarias para compilar mysqlclient
RUN apk add --no-cache \
    gcc \
    musl-dev \
    python3-dev \
    mariadb-dev \
    libffi-dev \
    build-base

# Copia los requisitos e instala dependencias Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto del código de la app
COPY . .
