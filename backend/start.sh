#!/bin/sh
set -e

echo "🚀 Iniciando Strapi..."
echo "📍 Variables de entorno:"
echo "   NODE_ENV: ${NODE_ENV:-not set}"
echo "   HOST: ${HOST:-not set}"
echo "   PORT: ${PORT:-not set}"
echo "   DATABASE_CLIENT: ${DATABASE_CLIENT:-not set}"
echo "   DATABASE_URL: ${DATABASE_URL:+set (hidden)}${DATABASE_URL:-not set}"

# Verificar que DATABASE_URL esté configurado
if [ -z "$DATABASE_URL" ] && [ "$DATABASE_CLIENT" = "postgres" ]; then
  echo "❌ ERROR: DATABASE_URL no está configurado pero DATABASE_CLIENT=postgres"
  echo "   Por favor configura DATABASE_URL en Railway"
  exit 1
fi

# Crear directorio de uploads si no existe
mkdir -p public/uploads

echo "✅ Directorio public/uploads creado"
echo "🔧 Ejecutando: npm start"

# Ejecutar Strapi y capturar errores
exec npm start 2>&1 | tee /tmp/strapi.log

