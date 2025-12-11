#!/bin/bash
# Script para exportar logs de Railway y compartirlos

echo "📋 Exportando logs de Railway..."
echo ""

# Verificar si Railway CLI está instalado
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI no está instalado"
    echo "   Instálalo con: npm install -g @railway/cli"
    echo "   Luego ejecuta: railway login"
    exit 1
fi

# Verificar si está logueado
if ! railway whoami &> /dev/null; then
    echo "❌ No estás logueado en Railway"
    echo "   Ejecuta: railway login"
    exit 1
fi

echo "✅ Railway CLI configurado"
echo ""

# Exportar logs del backend
echo "🔍 Obteniendo logs del Backend..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
railway logs --service backend --tail 100 > backend-logs.txt 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Logs del backend guardados en: backend-logs.txt"
    echo "   Últimas 20 líneas:"
    echo ""
    tail -20 backend-logs.txt
    echo ""
    echo "📄 Para ver todos los logs: cat backend-logs.txt"
else
    echo "❌ Error al obtener logs del backend"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Exportar logs del frontend
echo "🔍 Obteniendo logs del Frontend..."
railway logs --service frontend --tail 100 > frontend-logs.txt 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Logs del frontend guardados en: frontend-logs.txt"
else
    echo "⚠️  No se pudieron obtener logs del frontend (puede que no exista)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Resumen:"
echo "   - backend-logs.txt: Logs del servicio Backend"
echo "   - frontend-logs.txt: Logs del servicio Frontend"
echo ""
echo "💡 Puedes copiar el contenido de estos archivos y compartirlo"

