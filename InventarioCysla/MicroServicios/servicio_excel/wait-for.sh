#!/bin/sh
# wait-for.sh - espera hasta que un servicio esté disponible
# Uso: ./wait-for.sh host:port [--timeout=N] -- command args

# Configuración por defecto
TIMEOUT=15
HOST=""
PORT=""

# Parsear argumentos
while [ $# -gt 0 ]; do
    case "$1" in
        *:* )
        HOST=$(echo "$1" | cut -d : -f 1)
        PORT=$(echo "$1" | cut -d : -f 2)
        shift
        ;;
        --timeout=* )
        TIMEOUT="${1#*=}"
        shift
        ;;
        -- )
        shift
        break
        ;;
        * )
        break
        ;;
    esac
done

if [ -z "$HOST" ] || [ -z "$PORT" ]; then
    echo "Error: Debes especificar host:port" >&2
    exit 1
fi

echo "Esperando hasta $HOST:$PORT esté disponible (timeout: $TIMEOUT segundos)..."

# Esperar hasta que el puerto esté disponible
if ! timeout $TIMEOUT sh -c "until nc -z $HOST $PORT; do sleep 1; done"; then
    echo "Timeout alcanzado - $HOST:$PORT no está disponible" >&2
    exit 1
fi

# Verificación adicional para MySQL
if [ "$PORT" = "3306" ]; then
    echo "Verificando conexión a MySQL..."
    if [ -n "$MYSQL_USER" ] && [ -n "$MYSQL_PASSWORD" ] && [ -n "$MYSQL_DATABASE" ]; then
        until mysql -h"$HOST" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" -e "USE $MYSQL_DATABASE;" >/dev/null 2>&1; do
            echo "Esperando a que la base de datos '$MYSQL_DATABASE' esté lista..."
            sleep 2
        done
    fi
fi

echo "$HOST:$PORT está listo - ejecutando comando: $@"
exec "$@"