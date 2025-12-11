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
echo "🔧 Verificando que npm y node estén disponibles..."
which node && node --version
which npm && npm --version
echo "🔧 Ejecutando: npm start"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Ejecutar Strapi
# NO usar exec para poder capturar errores
npm start 2>&1 &
NPM_PID=$!

# Esperar un poco y verificar si el proceso sigue corriendo
sleep 5
if ! kill -0 $NPM_PID 2>/dev/null; then
  echo "❌ npm start se detuvo después de 5 segundos"
  echo "   Esperando 30 segundos para que puedas ver este mensaje..."
  sleep 30
  exit 1
fi

# Si el proceso sigue corriendo, esperar a que termine
wait $NPM_PID
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
  echo "❌ npm start terminó con código de error: $EXIT_CODE"
  echo "   Esperando 30 segundos para que puedas ver este mensaje..."
  sleep 30
fi

exit $EXIT_CODE

