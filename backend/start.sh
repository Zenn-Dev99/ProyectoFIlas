#!/bin/sh
# Script de inicio simplificado para Strapi

# Redirigir todo a stderr para que Railway lo capture
exec >&2

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 SCRIPT DE INICIO EJECUTADO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📍 Variables de entorno:"
echo "   NODE_ENV: ${NODE_ENV:-not set}"
echo "   HOST: ${HOST:-not set}"
echo "   PORT: ${PORT:-not set}"
echo "   DATABASE_CLIENT: ${DATABASE_CLIENT:-not set}"
if [ -n "$DATABASE_URL" ]; then
  echo "   DATABASE_URL: ✅ CONFIGURADO"
else
  echo "   DATABASE_URL: ❌ NO CONFIGURADO"
fi
echo ""

# Verificar DATABASE_URL
if [ -z "$DATABASE_URL" ] && [ "$DATABASE_CLIENT" = "postgres" ]; then
  echo "❌ ERROR: DATABASE_URL no está configurado pero DATABASE_CLIENT=postgres"
  echo "   Esperando 60 segundos..."
  sleep 60
  exit 1
fi

# Crear directorio de uploads
echo "📁 Creando directorio public/uploads..."
mkdir -p public/uploads
echo "✅ Directorio creado"
echo ""

# Verificar Node.js y npm
echo "🔧 Verificando entorno..."
echo "   Node.js: $(node --version)"
echo "   npm: $(npm --version)"
echo "   Directorio: $(pwd)"
echo ""

# Ejecutar Strapi
echo "🔧 Iniciando Strapi..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Ejecutar npm start directamente
exec npm start
