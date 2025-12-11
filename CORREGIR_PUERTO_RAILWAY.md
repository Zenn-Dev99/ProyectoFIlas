# 🔧 Corregir Configuración de Puerto en Railway

## 🚨 Problema Identificado

El dominio está configurado para el puerto **8080**, pero Next.js necesita usar el puerto que Railway asigna automáticamente a través de la variable `PORT`.

---

## ✅ Solución: Configurar el Puerto Correctamente

### Opción 1: Usar el Puerto que Railway Asigna (Recomendado)

Railway asigna automáticamente un puerto a través de la variable `PORT`. Next.js debe usar este puerto.

#### Paso 1: Actualizar el Dominio en Railway

1. **En Railway**, ve a tu **servicio Frontend**
2. **Ve a "Settings" → "Networking"**
3. **En el dominio existente**, haz clic en **"Update"** o edita la configuración
4. **En el campo "Port"**, NO pongas un número fijo
5. **Railway debería detectar automáticamente el puerto** que tu aplicación está usando
6. **Si te pide un puerto**, déjalo en blanco o usa el puerto que Railway sugiere

#### Paso 2: Verificar que Next.js Use el Puerto Correcto

Next.js ya está configurado para usar `process.env.PORT` o `3000` por defecto. El comando `next start -H 0.0.0.0` debería usar automáticamente el puerto de Railway.

---

### Opción 2: Configurar el Puerto Manualmente (Si es Necesario)

Si Railway requiere que especifiques un puerto manualmente:

1. **En Railway**, ve a **"Settings" → "Networking"**
2. **Actualiza el dominio** para usar el puerto **3000** (puerto por defecto de Next.js)
3. **O usa el puerto que Railway te asigne** (puede ser diferente)

---

## 🔍 Verificar la Configuración Actual

### Paso 1: Ver los Logs

1. **En Railway**, ve a tu **servicio Frontend**
2. **Ve a la pestaña "Logs"**
3. **Busca un mensaje como:**
   - `Ready on http://0.0.0.0:XXXX` (donde XXXX es el puerto)
   - O `> Ready on http://localhost:XXXX`

### Paso 2: Verificar el Puerto en los Logs

El puerto que aparece en los logs es el que Next.js está usando. **Ese es el puerto que debes configurar en el dominio**.

---

## 📋 Pasos para Corregir

### 1. Ver los Logs del Servicio

1. Ve a **Railway → Frontend → Logs**
2. Busca el mensaje que dice en qué puerto está escuchando Next.js
3. **Anota ese puerto**

### 2. Actualizar el Dominio

1. Ve a **Railway → Frontend → Settings → Networking**
2. Haz clic en **"Update"** en el dominio existente
3. **En el campo "Port"**, escribe el puerto que viste en los logs
4. Haz clic en **"Update"**

### 3. Esperar y Probar

1. Espera 1-2 minutos
2. Refresca la página del frontend
3. Debería funcionar correctamente

---

## ⚠️ Importante

- **NO configures el puerto como 8080** a menos que los logs muestren que Next.js está escuchando en ese puerto
- **NO configures el puerto como 3000** a menos que los logs muestren que Next.js está escuchando en ese puerto
- **Usa el puerto que aparece en los logs** cuando Next.js se inicia

---

## 🆘 Si No Ves el Puerto en los Logs

Si no ves el mensaje "Ready on", puede ser que:
1. El servidor no se esté iniciando
2. Hay un error que impide que se inicie
3. El build no se completó

En ese caso:
1. Revisa los logs completos para ver errores
2. Verifica que el build se completó exitosamente
3. Verifica que las variables de entorno estén configuradas

---

## ✅ Checklist

- [ ] Revisé los logs y encontré el puerto en el que Next.js está escuchando
- [ ] Actualicé el dominio para usar ese puerto
- [ ] Esperé 1-2 minutos después de actualizar
- [ ] Refresqué la página del frontend
- [ ] El frontend ahora funciona correctamente

---

## 💡 Nota

Railway puede asignar diferentes puertos en diferentes deployments. Si cambias el puerto y sigue sin funcionar, verifica nuevamente los logs para ver si el puerto cambió.

