# Script PowerShell para exportar logs de Railway y compartirlos

Write-Host "📋 Exportando logs de Railway..." -ForegroundColor Cyan
Write-Host ""

# Verificar si Railway CLI está instalado
try {
    $railwayVersion = railway --version 2>&1
    Write-Host "✅ Railway CLI encontrado" -ForegroundColor Green
} catch {
    Write-Host "❌ Railway CLI no está instalado" -ForegroundColor Red
    Write-Host "   Instálalo con: npm install -g @railway/cli" -ForegroundColor Yellow
    Write-Host "   Luego ejecuta: railway login" -ForegroundColor Yellow
    exit 1
}

# Verificar si está logueado
try {
    railway whoami | Out-Null
    Write-Host "✅ Estás logueado en Railway" -ForegroundColor Green
} catch {
    Write-Host "❌ No estás logueado en Railway" -ForegroundColor Red
    Write-Host "   Ejecuta: railway login" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Exportar logs del backend
Write-Host "🔍 Obteniendo logs del Backend..." -ForegroundColor Cyan
railway logs --service backend --tail 100 | Out-File -FilePath "backend-logs.txt" -Encoding utf8

if (Test-Path "backend-logs.txt") {
    Write-Host "✅ Logs del backend guardados en: backend-logs.txt" -ForegroundColor Green
    Write-Host ""
    Write-Host "   Últimas 20 líneas:" -ForegroundColor Yellow
    Write-Host ""
    Get-Content "backend-logs.txt" -Tail 20
    Write-Host ""
    Write-Host "📄 Para ver todos los logs: Get-Content backend-logs.txt" -ForegroundColor Cyan
} else {
    Write-Host "❌ Error al obtener logs del backend" -ForegroundColor Red
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Exportar logs del frontend
Write-Host "🔍 Obteniendo logs del Frontend..." -ForegroundColor Cyan
railway logs --service frontend --tail 100 | Out-File -FilePath "frontend-logs.txt" -Encoding utf8

if (Test-Path "frontend-logs.txt") {
    Write-Host "✅ Logs del frontend guardados en: frontend-logs.txt" -ForegroundColor Green
} else {
    Write-Host "⚠️  No se pudieron obtener logs del frontend (puede que no exista)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""
Write-Host "📋 Resumen:" -ForegroundColor Cyan
Write-Host "   - backend-logs.txt: Logs del servicio Backend" -ForegroundColor White
Write-Host "   - frontend-logs.txt: Logs del servicio Frontend" -ForegroundColor White
Write-Host ""
Write-Host "💡 Puedes copiar el contenido de estos archivos y compartirlo" -ForegroundColor Yellow

