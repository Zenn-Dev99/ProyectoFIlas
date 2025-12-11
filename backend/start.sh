#!/bin/sh
# No usar set -e para capturar todos los errores

echo "🚀 Iniciando Strapi..."
echo "📍 Variables de entorno:"
echo "   NODE_ENV: ${NODE_ENV:-not set}"
echo "   HOST: ${HOST:-not set}"
echo "   PORT: ${PORT:-not set}"
echo "   DATABASE_CLIENT: ${DATABASE_CLIENT:-not set}"
if [ -n "$DATABASE_URL" ]; then
  echo "   DATABASE_URL: set (hidden for security)"
else
  echo "   DATABASE_URL: NOT SET ⚠️"
fi

# Verificar que DATABASE_URL esté configurado
if [ -z "$DATABASE_URL" ] && [ "$DATABASE_CLIENT" = "postgres" ]; then
  echo "❌ ERROR: DATABASE_URL no está configurado pero DATABASE_CLIENT=postgres"
  echo "   Por favor configura DATABASE_URL en Railway"
  echo "   Esperando 10 segundos antes de salir para que puedas ver este mensaje..."
  sleep 10
  exit 1
fi

# Crear directorio de uploads si no existe
echo "📁 Creando directorio public/uploads..."
mkdir -p public/uploads || {
  echo "❌ Error al crear directorio public/uploads"
  sleep 10
  exit 1
}

echo "✅ Directorio public/uploads creado"
echo "🔧 Ejecutando: npm start"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Ejecutar Strapi con manejo de errores
npm start 2>&1 || {
  echo "❌ Error al ejecutar npm start"
  echo "   Código de salida: $?"
  echo "   Esperando 30 segundos antes de salir..."
  sleep 30
  exit 1
}

