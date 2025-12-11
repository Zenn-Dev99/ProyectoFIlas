# 🌐 Generar Dominio para el Frontend en Railway

## ✅ Prerequisitos

Antes de generar el dominio, asegúrate de que:

- [ ] El servicio Frontend está creado en Railway
- [ ] El Root Directory está configurado como `frontend`
- [ ] Las variables de entorno están configuradas:
  - `NEXT_PUBLIC_STRAPI_URL=https://proyectofilas-production.up.railway.app`
  - `NODE_ENV=production`
- [ ] El build está completado exitosamente (sin errores)

---

## 📋 Paso a Paso: Generar Dominio

### Paso 1: Ir a Settings del Servicio Frontend

1. **En Railway**, haz clic en tu **servicio Frontend**
2. **Haz clic en "Settings"** (icono de engranaje en la parte superior)

### Paso 2: Ir a la Sección de Networking

1. **En Settings**, busca la sección **"Networking"** o **"Domains"**
2. **Haz clic en "Networking"** o **"Generate Domain"**

### Paso 3: Generar el Dominio

1. **Haz clic en "Generate Domain"** o el botón similar
2. **En el campo "Enter the port your app is listening on":**
   - Escribe: `3000` (puerto por defecto de Next.js)
3. **Haz clic en "Generate Domain"** o "Create"

### Paso 4: Copiar la URL

1. Railway te dará una URL como:
   - `https://tu-frontend-production.up.railway.app`
2. **Copia esta URL** - la necesitarás para acceder a tu aplicación

---

## ✅ Verificar que Funciona

### Paso 1: Abrir la URL

1. **Abre tu navegador**
2. **Ve a la URL** que Railway te dio
3. **Deberías ver tu aplicación funcionando**

### Paso 2: Probar Funcionalidades

- **Página principal:** `/`
- **Panel de cajera:** `/cajera`
- **Panel de admin:** `/admin`
- **Pantalla TV:** `/tv`
- **Login:** `/login`

### Paso 3: Verificar Conexión con Backend

1. **Abre la consola del navegador** (F12)
2. **Ve a la pestaña "Console"**
3. **Navega por tu aplicación**
4. **No deberías ver errores** de conexión con Strapi

---

## 🔧 Si el Dominio No Funciona

### Problema: "Cannot GET /"

**Solución:**
- Verifica que el puerto sea `3000`
- Verifica que el build se completó exitosamente
- Revisa los logs del servicio en Railway

### Problema: "502 Bad Gateway"

**Solución:**
- Verifica que el servicio esté en estado "Active"
- Revisa los logs para ver si hay errores
- Espera unos minutos y vuelve a intentar

### Problema: No se conecta al backend

**Solución:**
- Verifica que `NEXT_PUBLIC_STRAPI_URL` tenga la URL correcta del backend
- Verifica que los permisos estén configurados en Strapi
- Revisa los logs del frontend en Railway

---

## 📝 Checklist Final

- [ ] Dominio generado en Railway
- [ ] URL copiada y guardada
- [ ] Frontend accesible en la URL pública
- [ ] Frontend se conecta correctamente al backend
- [ ] Todas las páginas funcionan correctamente

---

## 🎉 ¡Listo!

Una vez que el dominio esté generado y funcionando, tendrás:

- **Backend:** `https://proyectofilas-production.up.railway.app`
- **Frontend:** `https://tu-frontend-production.up.railway.app`

¡Tu aplicación estará completamente desplegada y accesible desde internet!

---

## 💡 Próximos Pasos (Opcional)

1. **Configurar un dominio personalizado** (si lo deseas)
2. **Configurar variables de Twilio** (si usas WhatsApp)
3. **Probar todas las funcionalidades**
4. **Configurar datos iniciales** en Strapi (sucursales, cajeras, etc.)

