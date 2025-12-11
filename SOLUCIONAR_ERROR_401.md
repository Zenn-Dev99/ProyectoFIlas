# 🔐 Solucionar Error 401 (Unauthorized) en Strapi

## 🚨 Error 401 - Unauthorized

Este error significa que **no estás autenticado** o tu **sesión expiró**.

---

## ✅ Solución: Iniciar Sesión de Nuevo

### Paso 1: Cerrar Sesión Actual

1. **En el panel de Strapi**, busca tu perfil (esquina superior derecha)
2. **Haz clic en tu nombre/avatar**
3. **Selecciona "Logout"** o "Cerrar Sesión"

### Paso 2: Iniciar Sesión de Nuevo

1. **Ve a:** `https://proyectofilas-production.up.railway.app/admin`
2. **Ingresa tus credenciales:**
   - Email/usuario
   - Contraseña
3. **Haz clic en "Login"**

### Paso 3: Configurar Permisos de Nuevo

1. **Espera a que cargue el panel** completamente
2. **Ve a:** Settings → Users & Permissions Plugin → Roles → Public
3. **Desplázate hacia abajo** hasta encontrar la sección **"Application"**
4. **Configura los permisos** de los Content Types
5. **Guarda los cambios**

---

## 🔍 Verificar que Estás Autenticado

### Señales de que estás autenticado:

- ✅ Ves tu nombre/avatar en la esquina superior derecha
- ✅ Puedes navegar por el panel sin problemas
- ✅ No te pide iniciar sesión constantemente

### Señales de que NO estás autenticado:

- ❌ Te redirige a la página de login
- ❌ No ves tu nombre en la esquina superior derecha
- ❌ Recibes errores 401 al intentar hacer cambios

---

## 🛠️ Solución Alternativa: Limpiar Cookies

Si el problema persiste:

1. **Abre las herramientas de desarrollador** (F12)
2. **Ve a la pestaña "Application"** o "Almacenamiento"
3. **Busca "Cookies"** en el menú lateral
4. **Selecciona:** `https://proyectofilas-production.up.railway.app`
5. **Elimina todas las cookies**
6. **Cierra y vuelve a abrir el navegador**
7. **Inicia sesión de nuevo**

---

## 🔄 Solución: Modo Incógnito

Si nada funciona, prueba en modo incógnito:

1. **Abre una ventana de incógnito** (Ctrl+Shift+N en Chrome)
2. **Ve a:** `https://proyectofilas-production.up.railway.app/admin`
3. **Inicia sesión**
4. **Intenta configurar los permisos**

Esto descarta problemas con cookies o caché.

---

## ⚠️ Verificar Variables de Entorno

El error 401 también puede ocurrir si faltan variables de autenticación:

### En Railway → Variables, verifica que tengas:

```
ADMIN_JWT_SECRET=...
JWT_SECRET=...
```

Si faltan, agrégalas y reinicia el servicio.

---

## 📝 Pasos Resumidos

1. **Cierra sesión** en Strapi
2. **Inicia sesión de nuevo**
3. **Espera a que cargue completamente**
4. **Ve a configurar permisos**
5. **Desplázate hasta "Application"**
6. **Configura los permisos**
7. **Guarda**

---

## 🆘 Si el Error Persiste

1. **Verifica que las variables de entorno estén correctas:**
   - `ADMIN_JWT_SECRET`
   - `JWT_SECRET`

2. **Reinicia el servicio en Railway:**
   - Ve a tu servicio Backend
   - Haz clic en "Restart" o "Redeploy"

3. **Espera 2-3 minutos** después del reinicio

4. **Intenta de nuevo**

---

## ✅ Checklist

- [ ] Cerraste sesión y volviste a iniciar sesión
- [ ] Tu sesión está activa (ves tu nombre en la esquina)
- [ ] Esperaste a que el panel cargue completamente
- [ ] Estás en la sección correcta (Application, no Plugin Users-permissions)
- [ ] Las variables de entorno están configuradas
- [ ] El servicio está corriendo en Railway

