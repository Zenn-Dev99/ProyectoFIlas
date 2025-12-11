# 📋 Cómo Compartir Logs conmigo

## 🚀 Opción 1: Usar Railway CLI (Recomendado)

### Paso 1: Instalar Railway CLI

```powershell
npm install -g @railway/cli
```

### Paso 2: Login

```powershell
railway login
```

### Paso 3: Conectar al Proyecto

```powershell
railway link
```

### Paso 4: Exportar Logs

**Windows (PowerShell):**
```powershell
.\scripts\exportar-logs-railway.ps1
```

**Linux/Mac:**
```bash
chmod +x scripts/exportar-logs-railway.sh
./scripts/exportar-logs-railway.sh
```

Esto creará archivos `backend-logs.txt` y `frontend-logs.txt` que puedes copiar y pegar aquí.

---

## 📋 Opción 2: Copiar Manualmente desde Railway

1. Ve a Railway → Tu servicio Backend
2. Haz clic en **"Deploy Logs"** o **"Build Logs"**
3. Selecciona todo el texto (Ctrl+A)
4. Copia (Ctrl+C)
5. Pégalo aquí en el chat

---

## 🔍 Opción 3: Usar Railway CLI Directamente

```powershell
# Ver logs del backend en tiempo real
railway logs --service backend

# Exportar últimos 100 logs a un archivo
railway logs --service backend --tail 100 > logs.txt

# Luego copia el contenido de logs.txt
```

---

## 📸 Opción 4: Captura de Pantalla

Si los logs son muy largos, puedes:
1. Tomar una captura de pantalla de los logs
2. Compartirla aquí
3. O usar una herramienta como [imgur](https://imgur.com) para subir la imagen

---

## 🎯 Qué Logs Necesito

Específicamente necesito ver:

1. **Los primeros logs al iniciar:**
   - `🚀 Iniciando Strapi...`
   - Variables de entorno
   - Cualquier error antes de que se detenga

2. **Errores de conexión a BD:**
   - `AggregateError`
   - `ECONNREFUSED`
   - `DATABASE_URL not set`

3. **Errores de build:**
   - Errores de TypeScript
   - Errores de npm install
   - Errores de Docker

---

## 💡 Tips

- **Mantén la pestaña de logs abierta** mientras se hace el deploy
- **Los primeros logs son los más importantes** - captúralos rápido
- **Si los logs se cortan**, usa Railway CLI para ver más
- **Comparte tanto Build Logs como Deploy Logs** si hay errores

---

## 🔧 Si Railway CLI No Funciona

Si no puedes instalar Railway CLI:

1. Ve a Railway → Backend → Deploy Logs
2. Haz clic derecho → "Inspect" o F12
3. Busca la sección de logs en el HTML
4. Copia el contenido

O simplemente copia y pega lo que veas en la interfaz de Railway.

