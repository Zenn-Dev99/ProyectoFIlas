# 🚀 Guía de Despliegue en Railway

Esta guía te ayudará a desplegar tanto el **Frontend (Next.js)** como el **Backend (Strapi)** en Railway.

## 📋 Requisitos Previos

1. Cuenta en Railway (https://railway.app)
2. Repositorio en GitHub conectado
3. $5 de crédito del plan gratuito (suficiente para testeo)

---

## 🔧 Paso 1: Desplegar el Backend (Strapi)

### 1.1 Crear Servicio Backend

1. Ve a tu proyecto en Railway
2. Haz clic en **"New Project"** o **"New Service"**
3. Selecciona **"Deploy from GitHub repo"**
4. Elige tu repositorio `ProyectoFIlas`
5. Railway detectará automáticamente el proyecto

### 1.2 Configurar el Servicio Backend

1. **Cambiar el Root Directory:**
   - Ve a **Settings** → **Service Settings**
   - En **Root Directory**, escribe: `backend`
   - Esto le dice a Railway que el código está en la carpeta `backend/`

2. **Configurar Variables de Entorno:**
   - Ve a **Variables** en el servicio backend
   - Agrega estas variables:

```env
# Base de datos (Railway proporciona PostgreSQL automáticamente)
DATABASE_CLIENT=postgres
DATABASE_URL=${{Postgres.DATABASE_URL}}

# O si prefieres SQLite (más simple para testeo):
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# Strapi
NODE_ENV=production
HOST=0.0.0.0
PORT=${{PORT}}

# App Keys (genera valores aleatorios)
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=random_salt_here
ADMIN_JWT_SECRET=random_jwt_secret_here
TRANSFER_TOKEN_SALT=random_transfer_salt_here
JWT_SECRET=random_jwt_secret_here

# CORS (importante para que el frontend pueda conectarse)
CORS_ORIGIN=*
```

**Para generar valores aleatorios:**
```bash
# En tu terminal local:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```
Ejecuta esto 5 veces para obtener los valores de `APP_KEYS`, `API_TOKEN_SALT`, etc.

### 1.3 Agregar Base de Datos PostgreSQL (Recomendado)

1. En Railway, haz clic en **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Esto creará una base de datos PostgreSQL
3. Railway automáticamente inyectará `DATABASE_URL` en las variables de entorno
4. Asegúrate de que `DATABASE_CLIENT=postgres` esté configurado

### 1.4 Verificar el Despliegue

1. Railway construirá y desplegará automáticamente
2. Una vez desplegado, verás una URL como: `https://tu-backend.up.railway.app`
3. Abre esa URL en el navegador
4. Deberías ver el panel de administración de Strapi
5. **Crea tu cuenta de administrador** (solo la primera vez)

---

## 🎨 Paso 2: Desplegar el Frontend (Next.js)

### 2.1 Crear Servicio Frontend

1. En el mismo proyecto de Railway, haz clic en **"New Service"**
2. Selecciona **"Deploy from GitHub repo"**
3. Elige el mismo repositorio `ProyectoFIlas`

### 2.2 Configurar el Servicio Frontend

1. **Cambiar el Root Directory:**
   - Ve a **Settings** → **Service Settings**
   - En **Root Directory**, escribe: `frontend`

2. **Configurar Variables de Entorno:**
   - Ve a **Variables** en el servicio frontend
   - Agrega estas variables:

```env
# URL del Backend (usa la URL de tu servicio backend de Railway)
NEXT_PUBLIC_STRAPI_URL=https://tu-backend.up.railway.app

# Twilio (si usas WhatsApp)
TWILIO_ACCOUNT_SID=tu_account_sid
TWILIO_AUTH_TOKEN=tu_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+1234567890
TWILIO_ACCOUNT_SID_FOR_API=tu_api_key_sid
TWILIO_API_KEY_SECRET=tu_api_key_secret

# Next.js
NODE_ENV=production
```

**⚠️ IMPORTANTE:** Reemplaza `https://tu-backend.up.railway.app` con la URL real de tu servicio backend.

### 2.3 Verificar el Despliegue

1. Railway construirá y desplegará automáticamente
2. Una vez desplegado, verás una URL como: `https://tu-frontend.up.railway.app`
3. Abre esa URL en el navegador
4. Deberías ver tu aplicación funcionando

---

## 🔗 Paso 3: Configurar CORS en Strapi

Para que el frontend pueda hacer peticiones al backend, necesitas configurar CORS:

1. Ve al panel de administración de Strapi (URL del backend)
2. Ve a **Settings** → **Users & Permissions Plugin** → **Advanced Settings**
3. En **CORS**, agrega la URL de tu frontend:
   - `https://tu-frontend.up.railway.app`
   - O usa `*` para permitir todas las URLs (solo para desarrollo)

**O configura CORS en el código:**

Edita `backend/config/middlewares.ts`:

```typescript
export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'https:'],
          'media-src': ["'self'", 'data:', 'blob:', 'https:'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: process.env.CORS_ORIGIN || '*',
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

---

## 📊 Paso 4: Configurar Permisos en Strapi

Después de desplegar, configura los permisos públicos:

1. Ve al panel de Strapi
2. **Settings** → **Users & Permissions Plugin** → **Roles** → **Public**
3. Habilita `find` y `findOne` para:
   - ✅ Turno
   - ✅ Cliente
   - ✅ Sucursal
   - ✅ Cajera
   - ✅ Publicidad
4. Guarda los cambios

---

## 💰 Monitorear el Uso de Créditos

1. Ve a **Settings** → **Usage** en Railway
2. Verás cuánto crédito has usado
3. **Apaga los servicios cuando no los uses** para ahorrar crédito

### Cómo Apagar Servicios:

1. Ve al servicio en Railway
2. Haz clic en el botón de **"Power"** o **"Pause"**
3. Los servicios se detendrán y no consumirán crédito
4. Vuelve a activarlos cuando necesites testear

---

## 🐛 Solución de Problemas

### Error: "next: not found"
- Asegúrate de que el Root Directory esté configurado como `frontend`
- Verifica que `railway.json` esté en la raíz del proyecto

### Error: "Cannot connect to Strapi"
- Verifica que `NEXT_PUBLIC_STRAPI_URL` apunte a la URL correcta del backend
- Asegúrate de que CORS esté configurado correctamente
- Verifica que el backend esté corriendo

### Error: "Database connection failed"
- Si usas PostgreSQL, verifica que `DATABASE_URL` esté configurado
- Si usas SQLite, asegúrate de que `DATABASE_CLIENT=sqlite`

### Los servicios no se conectan
- Verifica las URLs en las variables de entorno
- Asegúrate de que ambos servicios estén desplegados y corriendo
- Revisa los logs en Railway para ver errores

---

## ✅ Checklist Final

- [ ] Backend desplegado y accesible
- [ ] Frontend desplegado y accesible
- [ ] Variables de entorno configuradas
- [ ] CORS configurado en Strapi
- [ ] Permisos públicos configurados
- [ ] Base de datos conectada
- [ ] Cuenta de administrador creada en Strapi
- [ ] Servicios funcionando correctamente

---

## 🎉 ¡Listo!

Tu aplicación debería estar funcionando en Railway. Recuerda:
- Apagar los servicios cuando no los uses
- Monitorear el uso de créditos
- Los servicios se reinician automáticamente si fallan

