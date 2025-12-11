# 🔧 Solucionar Error 502 en Backend

## ❌ Problema

Error 502 (Bad Gateway) y timeouts al intentar acceder al backend. El servidor no está respondiendo.

## 🔍 Diagnóstico

Los errores muestran:
- `connection dial timeout` - El servidor no está escuchando
- `upstreamAddress: "http://[::]:8080"` - Railway intenta conectarse al puerto 8080
- El servidor puede estar crasheando al iniciar

## ✅ Soluciones

### 1. Verificar Variables de Entorno en Railway

En tu servicio Backend → Variables, asegúrate de tener:

```env
NODE_ENV=production
HOST=0.0.0.0
PORT=${{PORT}}  # Railway inyecta esto automáticamente
DATABASE_CLIENT=postgres
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

**⚠️ IMPORTANTE:** No configures `PORT` manualmente. Railway lo inyecta automáticamente.

### 2. Verificar Logs de Railway

1. Ve a tu servicio Backend en Railway
2. Haz clic en **"Deploy Logs"** o **"Build Logs"**
3. Busca errores como:
   - `Cannot connect to database`
   - `Error: Invalid PORT value`
   - `AggregateError`
   - `Module not found`

### 3. Verificar que PostgreSQL esté Conectado

El servidor puede no iniciar si no puede conectarse a PostgreSQL:

1. Verifica que el servicio PostgreSQL esté **"Online"**
2. Verifica que `DATABASE_URL` esté configurado correctamente
3. Revisa los logs para ver si hay errores de conexión a la base de datos

### 4. Verificar el Dockerfile

El Dockerfile debe:
- Exponer el puerto correctamente: `EXPOSE ${PORT:-1337}`
- Usar `HOST=0.0.0.0` para escuchar en todas las interfaces
- No hardcodear el puerto

### 5. Forzar Redeploy

Si todo está configurado correctamente pero sigue fallando:

1. Ve a tu servicio Backend
2. Haz clic en **"Redeploy"**
3. Espera a que termine el build y deploy
4. Revisa los logs nuevamente

### 6. Verificar Health Check

Railway puede estar haciendo health checks antes de que el servidor esté listo. Strapi puede tardar unos segundos en iniciar, especialmente la primera vez.

---

## 🧪 Probar Localmente

Para verificar que el servidor funciona:

```bash
cd backend
docker build -t fila-backend .
docker run -p 1337:1337 \
  -e NODE_ENV=production \
  -e HOST=0.0.0.0 \
  -e PORT=1337 \
  -e DATABASE_URL="tu_database_url" \
  -e APP_KEYS="..." \
  fila-backend
```

Si funciona localmente pero no en Railway, el problema es la configuración de Railway.

---

## 📋 Checklist

- [ ] `NODE_ENV=production` está configurado
- [ ] `HOST=0.0.0.0` está configurado
- [ ] `PORT` NO está configurado manualmente (Railway lo inyecta)
- [ ] `DATABASE_CLIENT=postgres` está configurado
- [ ] `DATABASE_URL` está configurado y es válido
- [ ] PostgreSQL está "Online" en Railway
- [ ] No hay errores en los logs de build
- [ ] No hay errores en los logs de deploy
- [ ] El Dockerfile expone el puerto correctamente

---

## 🔍 Logs Importantes a Revisar

Busca en los logs:
- ✅ `🚀 Strapi iniciado correctamente` - El servidor inició
- ✅ `Database connection has been established` - La BD está conectada
- ❌ `Cannot connect to database` - Problema con PostgreSQL
- ❌ `Error: Invalid PORT` - Problema con el puerto
- ❌ `AggregateError` - Múltiples errores (generalmente BD)

---

## 💡 Si Nada Funciona

1. **Elimina y recrea el servicio Backend:**
   - Esto puede resolver problemas de configuración persistentes

2. **Verifica que no haya conflictos de puerto:**
   - Railway asigna puertos automáticamente, no deberías tener conflictos

3. **Contacta soporte de Railway:**
   - Si el problema persiste, puede ser un issue de Railway

