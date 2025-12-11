# 🔧 Configuración de Variables en Railway

Railway tiene dos tipos de variables:

## 📦 Variables de PROYECTO (Project Variables)
- Se comparten entre **TODOS los servicios** del proyecto
- Útiles para valores que ambos servicios necesitan
- Se configuran en: **Project Settings → Variables**

## 🎯 Variables de SERVICIO (Service Variables)
- Son **específicas de cada servicio**
- Solo ese servicio puede usarlas
- Se configuran en: **Service → Variables**

---

## ✅ Configuración Recomendada

### Variables de PROYECTO (Opcional - Solo si ambos servicios las necesitan)
Ninguna en este caso, porque cada servicio tiene variables diferentes.

### Variables de SERVICIO - BACKEND

Ve a: **Tu Servicio Backend → Variables → Add Variable**

Agrega estas variables **una por una**:

```
DATABASE_CLIENT=postgres
DATABASE_URL=${{Postgres.DATABASE_URL}}
NODE_ENV=production
HOST=0.0.0.0
PORT=${{PORT}}
CORS_ORIGIN=*

APP_KEYS=tu_app_keys_aqui
API_TOKEN_SALT=tu_api_token_salt_aqui
ADMIN_JWT_SECRET=tu_admin_jwt_secret_aqui
TRANSFER_TOKEN_SALT=tu_transfer_token_salt_aqui
JWT_SECRET=tu_jwt_secret_aqui
```

**⚠️ IMPORTANTE:** 
- Si Railway te pregunta "Add as Project Variable?", selecciona **NO**
- O asegúrate de estar en la pestaña **Service Variables**, no **Project Variables**

### Variables de SERVICIO - FRONTEND

Ve a: **Tu Servicio Frontend → Variables → Add Variable**

Agrega estas variables:

```
NEXT_PUBLIC_STRAPI_URL=https://tu-backend.up.railway.app
NODE_ENV=production
```

**⚠️ IMPORTANTE:**
- Reemplaza `https://tu-backend.up.railway.app` con la URL real de tu backend
- Si Railway te pregunta "Add as Project Variable?", selecciona **NO**

---

## 🎯 ¿Dónde Agregar las Variables?

### Opción 1: Desde el Servicio (Recomendado)

1. Ve a tu **Servicio Backend** en Railway
2. Haz clic en la pestaña **Variables**
3. Haz clic en **Add Variable**
4. Asegúrate de que dice **"Service Variable"** (no Project Variable)
5. Agrega cada variable

### Opción 2: Desde Project Settings (Si se agregaron como Project Variables)

1. Ve a **Project Settings → Variables**
2. Si ves variables que deberían ser de servicio, puedes:
   - Eliminarlas de Project Variables
   - Agregarlas de nuevo como Service Variables

---

## 💡 ¿Puedo Tenerlas Todas en Project Variables?

**Técnicamente SÍ**, pero **NO es recomendable** porque:

❌ **Desventajas:**
- Todas las variables estarán disponibles para todos los servicios
- Puede causar conflictos (ej: el frontend verá variables del backend)
- Menos organización y seguridad
- Más difícil de mantener

✅ **Ventajas de separarlas:**
- Mejor organización
- Más seguro (cada servicio solo ve lo que necesita)
- Más fácil de mantener
- Mejores prácticas

---

## 🔍 Cómo Verificar

1. Ve a tu **Servicio Backend → Variables**
2. Deberías ver solo las variables del backend
3. Ve a tu **Servicio Frontend → Variables**
4. Deberías ver solo las variables del frontend

---

## 🚨 Si Ya Agregaste Variables como Project Variables

No te preocupes, puedes:

1. **Eliminarlas de Project Variables:**
   - Ve a **Project Settings → Variables**
   - Elimina las variables que agregaste

2. **Agregarlas como Service Variables:**
   - Ve a cada servicio individualmente
   - Agrega las variables correspondientes

---

## ✅ Resumen

- **Backend:** Variables en **Servicio Backend → Variables**
- **Frontend:** Variables en **Servicio Frontend → Variables**
- **NO uses Project Variables** a menos que ambos servicios necesiten la misma variable


