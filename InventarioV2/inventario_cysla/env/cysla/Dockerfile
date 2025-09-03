FROM python:3.12-alpine


WORKDIR /app


RUN apk add --no-cache \
    gcc \
    musl-dev \
    python3-dev \
    libffi-dev \
    mariadb-dev \
    build-base \
    pkgconfig


COPY requirements.txt .


RUN pip install --no-cache-dir -r requirements.txt

COPY . .


CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]



