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
echo ""
echo "🔧 Verificando entorno..."
echo "   Node.js: $(node --version 2>&1 || echo 'NO ENCONTRADO')"
echo "   npm: $(npm --version 2>&1 || echo 'NO ENCONTRADO')"
echo "   Directorio actual: $(pwd)"
echo "   Archivos en /app: $(ls -la /app 2>&1 | head -5)"
echo ""
echo "🔧 Ejecutando: npm start"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Forzar flush de output para que se vea inmediatamente
echo "⏳ Iniciando Strapi (esto puede tardar unos segundos)..." >&2

# Ejecutar Strapi y capturar output en tiempo real
npm start 2>&1 | while IFS= read -r line; do
  echo "$line"
  # Si vemos un error crítico, mostrarlo claramente
  if echo "$line" | grep -qi "error\|fatal\|cannot\|failed"; then
    echo "⚠️ ERROR DETECTADO EN LOGS: $line" >&2
  fi
done

EXIT_CODE=${PIPESTATUS[0]}

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $EXIT_CODE -ne 0 ]; then
  echo "❌ npm start terminó con código de error: $EXIT_CODE"
  echo "   Esto significa que Strapi no pudo iniciar correctamente"
  echo "   Revisa los logs arriba para ver el error específico"
  echo ""
  echo "   Esperando 60 segundos para que puedas ver este mensaje..."
  sleep 60
else
  echo "✅ npm start terminó normalmente (código: $EXIT_CODE)"
fi

exit $EXIT_CODE

