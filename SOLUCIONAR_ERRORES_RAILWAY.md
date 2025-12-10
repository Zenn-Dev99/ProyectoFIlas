# 🔧 Solucionar Errores de Deployment en Railway

## 🚨 Veo que tienes deployments fallando

Para solucionarlo, sigue estos pasos:

---

## 📋 Paso 1: Ver los Logs del Error

1. **Haz clic en el deployment que falló** (los que tienen el ícono rojo de error)
2. **Ve a la pestaña "Logs"** o "Build Logs"
3. **Copia el error completo** que aparece al final

Los errores más comunes son:

### Error 1: "next: not found" o "command not found"
**Causa:** Root Directory no configurado o incorrecto
**Solución:** 
- Ve a Settings → Service Settings → Root Directory
- Para Backend: escribe `backend`
- Para Frontend: escribe `frontend`

### Error 2: "Missing environment variables"
**Causa:** Faltan variables de entorno necesarias
**Solución:**
- Ve a Variables y agrega las variables necesarias
- Ver `VARIABLES_RAILWAY_BACKEND.txt` y `VARIABLES_RAILWAY_FRONTEND.txt`

### Error 3: "Database connection failed"
**Causa:** No hay base de datos o DATABASE_URL incorrecto
**Solución:**
- Agrega una base de datos PostgreSQL en Railway
- O cambia a SQLite: `DATABASE_CLIENT=sqlite`

### Error 4: "Build failed" o errores de compilación
**Causa:** Errores en el código o dependencias
**Solución:**
- Revisa los logs para ver el error específico
- Verifica que todas las dependencias estén en package.json

---

## 🔍 Paso 2: Verificar Configuración del Servicio

### Para el BACKEND:

1. **Root Directory:**
   - Ve a Settings → Service Settings
   - Root Directory debe ser: `backend`

2. **Variables de Entorno:**
   - Ve a Variables
   - Debe tener al menos:
     - `DATABASE_CLIENT=sqlite` (o `postgres`)
     - `NODE_ENV=production`
     - `HOST=0.0.0.0`
     - `PORT=${{PORT}}`
     - `APP_KEYS=...` (generadas)
     - `JWT_SECRET=...` (generado)

### Para el FRONTEND:

1. **Root Directory:**
   - Ve a Settings → Service Settings
   - Root Directory debe ser: `frontend`

2. **Variables de Entorno:**
   - Ve a Variables
   - Debe tener:
     - `NEXT_PUBLIC_STRAPI_URL=https://tu-backend.up.railway.app`
     - `NODE_ENV=production`

---

## 🛠️ Paso 3: Solución Rápida (Si es el primer despliegue)

### Opción A: Usar SQLite (Más simple para empezar)

**En el servicio Backend → Variables:**
```
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
NODE_ENV=production
HOST=0.0.0.0
PORT=${{PORT}}
CORS_ORIGIN=*
APP_KEYS=clave1,clave2,clave3,clave4
API_TOKEN_SALT=clave_generada
ADMIN_JWT_SECRET=clave_generada
TRANSFER_TOKEN_SALT=clave_generada
JWT_SECRET=clave_generada
```

**Para generar las claves, ejecuta:**
```bash
node scripts/configurar-railway-backend.js
```

### Opción B: Usar PostgreSQL

1. **Agrega una base de datos:**
   - En Railway, haz clic en "New" → "Database" → "Add PostgreSQL"

2. **Variables del Backend:**
```
DATABASE_CLIENT=postgres
DATABASE_URL=${{Postgres.DATABASE_URL}}
NODE_ENV=production
HOST=0.0.0.0
PORT=${{PORT}}
CORS_ORIGIN=*
APP_KEYS=...
JWT_SECRET=...
```

---

## 📝 Paso 4: Reintentar el Deployment

1. **Haz clic en "Deploy"** o "Redeploy"
2. **Espera a que termine el build**
3. **Revisa los logs** si vuelve a fallar

---

## 🆘 Si Aún No Funciona

1. **Copia el error completo de los logs**
2. **Verifica:**
   - ✅ Root Directory configurado
   - ✅ Variables de entorno agregadas
   - ✅ Base de datos agregada (si usas PostgreSQL)
   - ✅ No hay errores de sintaxis en el código

---

## 💡 Tips

- **Empieza con SQLite** para testear más rápido
- **Revisa los logs** siempre que falle
- **Verifica el Root Directory** es el error más común
- **Las variables de entorno son críticas** para Strapi

