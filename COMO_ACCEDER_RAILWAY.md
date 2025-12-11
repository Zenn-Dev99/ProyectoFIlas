# 🌐 Cómo Acceder a tu Aplicación en Railway

## ❌ NO uses `0.0.0.0:8080`

`0.0.0.0` es una dirección interna que solo funciona dentro del servidor. No puedes acceder desde tu navegador.

---

## ✅ Cómo Encontrar la URL Correcta

### Paso 1: Ve a tu Servicio en Railway

1. Abre Railway (https://railway.app)
2. Ve a tu proyecto
3. Haz clic en el servicio **Backend** (o el servicio que quieras acceder)

### Paso 2: Encuentra la URL Pública

Hay dos formas:

#### Opción A: Desde Settings → Domains
1. En tu servicio, ve a **Settings**
2. Haz clic en **Domains** o **Generate Domain**
3. Railway te dará una URL como: `https://tu-backend-production.up.railway.app`
4. **Copia esa URL**

#### Opción B: Desde el Dashboard
1. En la vista del servicio, busca una sección que diga **"Domains"** o **"Public URL"**
2. Verás una URL como: `https://tu-backend-production.up.railway.app`
3. **Copia esa URL**

---

## 🎯 Acceder al Panel de Administración de Strapi

Una vez que tengas la URL pública (ej: `https://tu-backend-production.up.railway.app`):

1. **Abre tu navegador**
2. **Ve a:** `https://tu-backend-production.up.railway.app/admin`
3. Deberías ver el panel de administración de Strapi
4. **Crea tu cuenta de administrador** (solo la primera vez)

---

## 🔍 Si No Ves la URL Pública

### Generar un Dominio:

1. Ve a tu servicio en Railway
2. Haz clic en **Settings**
3. Busca **"Domains"** o **"Generate Domain"**
4. Haz clic en **"Generate Domain"** o **"Add Domain"**
5. Railway generará una URL automáticamente

### Verificar que el Servicio Esté Corriendo:

1. Ve a la pestaña **"Deployments"** o **"Logs"**
2. Verifica que el último deployment esté en estado **"Active"** o **"Running"**
3. Si está fallando, revisa los logs para ver el error

---

## 📝 Ejemplo de URLs Correctas

### Backend (Strapi):
- ✅ `https://tu-backend-production.up.railway.app/admin`
- ✅ `https://tu-backend-production.up.railway.app/api/turnos`
- ❌ `http://0.0.0.0:8080/admin` (NO funciona)

### Frontend (Next.js):
- ✅ `https://tu-frontend-production.up.railway.app`
- ✅ `https://tu-frontend-production.up.railway.app/cajera`
- ❌ `http://localhost:3000` (solo funciona localmente)

---

## 🆘 Si la URL No Funciona

### Verifica:

1. **El servicio está corriendo:**
   - Ve a Deployments y verifica que esté "Active"

2. **Las variables de entorno están configuradas:**
   - Ve a Variables y verifica que todas estén agregadas

3. **No hay errores en los logs:**
   - Ve a Logs y revisa si hay errores

4. **El dominio está generado:**
   - Ve a Settings → Domains y genera uno si no existe

---

## 💡 Tips

- Railway genera URLs automáticamente cuando despliegas
- Las URLs son HTTPS por defecto (más seguro)
- Puedes cambiar el dominio en Settings → Domains
- Los servicios pueden tardar unos minutos en estar disponibles después del deployment

