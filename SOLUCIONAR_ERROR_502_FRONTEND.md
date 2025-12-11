# 🔧 Solucionar Error 502 (Bad Gateway) en Frontend

## 🚨 Error 502 - Connection Refused

El error 502 con "connection refused" significa que Railway no puede conectarse a tu aplicación. Esto puede deberse a varios problemas.

---

## ✅ Soluciones Paso a Paso

### Solución 1: Verificar que el Servicio Esté Corriendo

1. **En Railway**, ve a tu **servicio Frontend**
2. **Ve a la pestaña "Deployments"**
3. **Verifica que el último deployment esté en estado "Active"** o "Running"
4. **Si está en "Failed" o "Building"**, espera a que termine

---

### Solución 2: Verificar el Puerto

El error puede ser que Next.js no esté escuchando en el puerto correcto.

#### Verificar Variables de Entorno:

1. **En Railway**, ve a tu **servicio Frontend**
2. **Ve a "Variables"**
3. **Verifica que NO tengas una variable `PORT`** (Railway la inyecta automáticamente)
4. **Si tienes `PORT` manualmente configurada, elimínala**

#### Verificar que Next.js Use el Puerto Correcto:

Next.js debería usar automáticamente `process.env.PORT` o `3000` por defecto.

---

### Solución 3: Verificar los Logs

1. **En Railway**, ve a tu **servicio Frontend**
2. **Ve a la pestaña "Logs"**
3. **Busca errores** como:
   - "Error: listen EADDRINUSE" (puerto en uso)
   - "Error: Cannot find module" (dependencias faltantes)
   - "Error: ENOENT" (archivo no encontrado)
4. **Copia los errores** y compártelos

---

### Solución 4: Verificar Variables de Entorno Requeridas

Asegúrate de tener estas variables configuradas:

```
NEXT_PUBLIC_STRAPI_URL=https://proyectofilas-production.up.railway.app
NODE_ENV=production
```

**NO agregues `PORT`** - Railway la inyecta automáticamente.

---

### Solución 5: Verificar el Start Command

1. **En Railway**, ve a tu **servicio Frontend**
2. **Ve a "Settings" → "Service Settings"**
3. **Verifica el "Start Command"**:
   - Debería ser: `cd frontend && npm start`
   - O simplemente: `npm start` (si el Root Directory está configurado como `frontend`)

---

### Solución 6: Reiniciar el Servicio

1. **En Railway**, ve a tu **servicio Frontend**
2. **Haz clic en "..." (tres puntos)**
3. **Selecciona "Restart"** o "Redeploy"
4. **Espera a que termine** (puede tardar 2-3 minutos)

---

### Solución 7: Verificar el Build

1. **En Railway**, ve a tu **servicio Frontend**
2. **Ve a la pestaña "Deployments"**
3. **Haz clic en el último deployment**
4. **Verifica que el build se completó exitosamente**
5. **Si hay errores en el build**, corrígelos primero

---

## 🔍 Diagnóstico Rápido

### Checklist:

- [ ] El servicio está en estado "Active"
- [ ] El build se completó exitosamente
- [ ] Las variables de entorno están configuradas
- [ ] NO hay variable `PORT` manualmente configurada
- [ ] El Root Directory está configurado como `frontend`
- [ ] El Start Command es correcto
- [ ] No hay errores en los logs

---

## 🆘 Si Nada Funciona

### Opción 1: Revisar los Logs Completos

1. **En Railway**, ve a **"Logs"**
2. **Copia los últimos 50-100 líneas** de logs
3. **Busca errores** específicos

### Opción 2: Verificar la Configuración de Next.js

Asegúrate de que `next.config.js` no tenga configuraciones que puedan causar problemas.

### Opción 3: Verificar el package.json

Asegúrate de que el script `start` esté configurado correctamente:
```json
{
  "scripts": {
    "start": "next start"
  }
}
```

---

## 📝 Información Útil

### Puerto por Defecto de Next.js:
- **Desarrollo:** `3000`
- **Producción:** Usa `process.env.PORT` o `3000` por defecto

### Railway Inyecta Automáticamente:
- `PORT` - El puerto que Railway asigna
- `RAILWAY_ENVIRONMENT` - El entorno (production, etc.)

### No Configures Manualmente:
- ❌ `PORT` - Railway la inyecta automáticamente
- ✅ `NEXT_PUBLIC_STRAPI_URL` - Debes configurarla
- ✅ `NODE_ENV` - Debes configurarla como `production`

---

## ✅ Después de Corregir

1. **Espera 2-3 minutos** después de hacer cambios
2. **Refresca la página** del frontend
3. **Verifica que funcione** correctamente

---

## 🎯 Resumen

El error 502 generalmente se debe a:
1. **Servicio no corriendo** - Verifica el estado en Railway
2. **Puerto incorrecto** - No configures `PORT` manualmente
3. **Build fallido** - Revisa los logs del build
4. **Variables faltantes** - Verifica las variables de entorno
5. **Start command incorrecto** - Verifica la configuración

¡Revisa estos puntos y el problema debería resolverse!

