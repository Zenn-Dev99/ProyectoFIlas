# 🎨 Desplegar el Frontend en Railway

## ✅ Backend Listo

Tu backend está funcionando en:
**https://proyectofilas-production.up.railway.app**

Los permisos ya están configurados. Ahora despliega el frontend.

---

## 📋 Paso 1: Crear Servicio Frontend

### 1.1 En Railway:

1. **Ve a tu proyecto en Railway**
2. **Haz clic en "New Service"** o el botón **"+"**
3. **Selecciona "Deploy from GitHub repo"**
4. **Elige el mismo repositorio:** `ProyectoFIlas`
5. Railway comenzará a detectar el proyecto

---

## 🔧 Paso 2: Configurar Root Directory

### 2.1 Cambiar el Root Directory:

1. **Haz clic en tu nuevo servicio Frontend**
2. **Ve a Settings** (icono de engranaje)
3. **Haz clic en "Service Settings"**
4. **Busca "Root Directory"**
5. **Escribe:** `frontend`
6. **Guarda los cambios**

⚠️ **IMPORTANTE:** Esto le dice a Railway que el código del frontend está en la carpeta `frontend/`

---

## 🌐 Paso 3: Generar Dominio

### 3.1 Crear Dominio Público:

1. **En tu servicio Frontend**, ve a **Settings**
2. **Haz clic en "Networking"** o "Domains"
3. **Haz clic en "Generate Domain"**
4. **En el campo "Enter the port your app is listening on":**
   - Escribe: `3000` (puerto por defecto de Next.js)
5. **Haz clic en "Generate Domain"**
6. **Copia la URL** que Railway te da (ej: `https://tu-frontend-production.up.railway.app`)

---

## 🔑 Paso 4: Configurar Variables de Entorno

### 4.1 Agregar Variables:

1. **En tu servicio Frontend**, ve a **Variables**
2. **Haz clic en "Add Variable"**
3. **Agrega estas variables UNA POR UNA:**

#### Variable 1:
- **Nombre:** `NEXT_PUBLIC_STRAPI_URL`
- **Valor:** `https://proyectofilas-production.up.railway.app`

#### Variable 2:
- **Nombre:** `NODE_ENV`
- **Valor:** `production`

### 4.2 Variables Opcionales (Si usas WhatsApp/Twilio):

Si quieres usar el chatbot de WhatsApp, agrega también:

- **Nombre:** `TWILIO_ACCOUNT_SID`
- **Valor:** `tu_account_sid` (el que tienes configurado)

- **Nombre:** `TWILIO_AUTH_TOKEN`
- **Valor:** `tu_auth_token` (el que tienes configurado)

- **Nombre:** `TWILIO_WHATSAPP_NUMBER`
- **Valor:** `whatsapp:+1234567890` (tu número de Twilio)

- **Nombre:** `TWILIO_ACCOUNT_SID_FOR_API`
- **Valor:** `tu_api_key_sid` (si usas API Keys)

- **Nombre:** `TWILIO_API_KEY_SECRET`
- **Valor:** `tu_api_key_secret` (si usas API Keys)

---

## 🚀 Paso 5: Verificar el Despliegue

### 5.1 Railway Desplegará Automáticamente:

1. **Railway detectará los cambios** y comenzará a construir
2. **Ve a la pestaña "Deployments"** para ver el progreso
3. **Espera a que termine** (puede tardar 3-5 minutos)
4. **Verifica que el estado sea "Active"** o "Running"

### 5.2 Revisar los Logs (Si hay errores):

1. **Ve a la pestaña "Logs"**
2. **Busca errores** en la construcción
3. **Si hay errores**, cópialos y compártelos

---

## ✅ Paso 6: Probar el Frontend

### 6.1 Abrir la URL:

1. **Abre tu navegador**
2. **Ve a la URL** que Railway te dio (ej: `https://tu-frontend-production.up.railway.app`)
3. **Deberías ver tu aplicación**

### 6.2 Probar las Funcionalidades:

- **Página principal:** `/`
- **Panel de cajera:** `/cajera`
- **Panel de admin:** `/admin`
- **Pantalla TV:** `/tv`
- **Login:** `/login`

---

## 🔗 Paso 7: Verificar la Conexión con el Backend

### 7.1 Probar que el Frontend se Conecte al Backend:

1. **Abre la consola del navegador** (F12)
2. **Ve a la pestaña "Console"**
3. **Navega por tu aplicación**
4. **No deberías ver errores** de conexión con Strapi

### 7.2 Si Hay Errores de Conexión:

- **Verifica que `NEXT_PUBLIC_STRAPI_URL`** tenga la URL correcta del backend
- **Verifica que los permisos** estén configurados en Strapi
- **Revisa los logs** del frontend en Railway

---

## 📝 Checklist Final

- [ ] Servicio Frontend creado en Railway
- [ ] Root Directory configurado como `frontend`
- [ ] Dominio generado (URL pública)
- [ ] Variable `NEXT_PUBLIC_STRAPI_URL` configurada con la URL del backend
- [ ] Variable `NODE_ENV=production` configurada
- [ ] Deployment completado y en estado "Active"
- [ ] Frontend accesible en la URL pública
- [ ] Frontend se conecta correctamente al backend

---

## 🆘 Solución de Problemas Comunes

### Error: "next: not found"
- **Solución:** Verifica que el Root Directory esté configurado como `frontend`

### Error: "Cannot connect to Strapi"
- **Solución:** Verifica que `NEXT_PUBLIC_STRAPI_URL` tenga la URL correcta
- **Solución:** Verifica que los permisos estén configurados en Strapi

### Error: "Build failed"
- **Solución:** Revisa los logs para ver el error específico
- **Solución:** Verifica que todas las dependencias estén en `package.json`

---

## 🎉 ¡Listo!

Una vez que el frontend esté desplegado, tendrás:

- **Backend:** `https://proyectofilas-production.up.railway.app`
- **Frontend:** `https://tu-frontend-production.up.railway.app`

¡Tu aplicación estará completamente desplegada!

---

## 💡 Próximos Pasos (Opcional)

1. **Configurar un dominio personalizado** (si lo deseas)
2. **Configurar variables de Twilio** (si usas WhatsApp)
3. **Probar todas las funcionalidades**
4. **Configurar datos iniciales** en Strapi (sucursales, cajeras, etc.)

