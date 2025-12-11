# ✅ Backend Desplegado - Próximos Pasos

## 🎉 ¡Felicidades!

Tu backend está funcionando en:
**https://proyectofilas-production.up.railway.app**

Ya creaste tu cuenta de administrador. Ahora sigue estos pasos:

---

## 📋 Paso 1: Configurar Permisos en Strapi

Para que el frontend pueda acceder a los datos:

1. **Ve al panel de Strapi:**
   - URL: `https://proyectofilas-production.up.railway.app/admin`
   - Inicia sesión con tu cuenta de administrador

2. **Configura los permisos públicos:**
   - Ve a **Settings** → **Users & Permissions Plugin** → **Roles** → **Public**
   - Habilita `find` y `findOne` para:
     - ✅ Turno
     - ✅ Cliente
     - ✅ Sucursal
     - ✅ Cajera
     - ✅ Publicidad
   - Guarda los cambios

---

## 🎨 Paso 2: Desplegar el Frontend

### 2.1 Crear Servicio Frontend en Railway

1. En Railway, en el mismo proyecto
2. Haz clic en **"New Service"** o **"+"**
3. Selecciona **"Deploy from GitHub repo"**
4. Elige el mismo repositorio `ProyectoFIlas`

### 2.2 Configurar el Servicio Frontend

1. **Root Directory:**
   - Ve a **Settings** → **Service Settings**
   - En **Root Directory**, escribe: `frontend`

2. **Generar Dominio:**
   - Ve a **Settings** → **Networking**
   - Haz clic en **"Generate Domain"**
   - Deja el puerto en `3000` (o el que use Next.js)
   - Copia la URL que Railway te da

3. **Variables de Entorno:**
   - Ve a **Variables** en el servicio frontend
   - Agrega estas variables:

```
NEXT_PUBLIC_STRAPI_URL=https://proyectofilas-production.up.railway.app
NODE_ENV=production
```

**⚠️ IMPORTANTE:** Usa la URL exacta de tu backend: `https://proyectofilas-production.up.railway.app`

### 2.3 Variables Opcionales (Si usas WhatsApp/Twilio):

```
TWILIO_ACCOUNT_SID=tu_account_sid
TWILIO_AUTH_TOKEN=tu_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+1234567890
TWILIO_ACCOUNT_SID_FOR_API=tu_api_key_sid
TWILIO_API_KEY_SECRET=tu_api_key_secret
```

---

## 🔗 Paso 3: Verificar que Todo Funcione

### Backend:
- ✅ URL: `https://proyectofilas-production.up.railway.app/admin`
- ✅ Panel de administración accesible
- ✅ Cuenta de administrador creada

### Frontend (después de desplegar):
- ✅ URL: `https://tu-frontend-production.up.railway.app`
- ✅ Debe conectarse al backend
- ✅ Debe mostrar la aplicación

---

## 🧪 Probar la Conexión

### Probar el Backend directamente:

Abre en tu navegador:
```
https://proyectofilas-production.up.railway.app/api/turnos
```

Deberías ver una respuesta JSON (puede estar vacía si no hay datos).

### Probar desde el Frontend:

Una vez desplegado el frontend, abre:
```
https://tu-frontend-production.up.railway.app
```

Deberías ver tu aplicación funcionando.

---

## 📝 Checklist

- [x] Backend desplegado
- [x] Dominio generado: `proyectofilas-production.up.railway.app`
- [x] Cuenta de administrador creada
- [ ] Permisos públicos configurados en Strapi
- [ ] Servicio Frontend creado en Railway
- [ ] Root Directory configurado como `frontend`
- [ ] Dominio del frontend generado
- [ ] Variable `NEXT_PUBLIC_STRAPI_URL` configurada
- [ ] Frontend desplegado y funcionando

---

## 🆘 Si Hay Problemas

### El frontend no se conecta al backend:
- Verifica que `NEXT_PUBLIC_STRAPI_URL` tenga la URL correcta
- Verifica que los permisos públicos estén configurados en Strapi
- Revisa los logs del frontend en Railway

### Error de CORS:
- Verifica que `CORS_ORIGIN` en el backend permita la URL del frontend
- O usa `CORS_ORIGIN=*` para desarrollo

---

## 🎉 ¡Siguiente Paso!

Ahora despliega el frontend siguiendo el **Paso 2** de arriba.

¿Necesitas ayuda con algún paso específico?

