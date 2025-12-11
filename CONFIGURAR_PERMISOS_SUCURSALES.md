# 🔐 Configurar Permisos para Sucursales y Otros Content Types

## ❌ Error Actual
```
GET /api/sucursales?populate=*&sort=nombre:asc 403 (Forbidden)
```

Este error indica que los permisos no están configurados para permitir el acceso público o autenticado a las sucursales.

---

## 📋 Pasos para Configurar Permisos

### 1. Acceder al Panel de Administración

1. Ve a: `https://proyectofilas-production.up.railway.app/admin`
2. Inicia sesión con tus credenciales de administrador

### 2. Configurar Permisos para "Public" (Acceso Público)

**Para que el frontend pueda acceder sin autenticación:**

1. En el menú lateral, ve a **Settings** → **Users & Permissions Plugin** → **Roles**
2. Haz clic en **"Public"** (rol público)
3. En la sección **"Permissions"**, busca **"Sucursal"**
4. Marca las siguientes casillas:
   - ✅ **find** (permitir buscar/listar)
   - ✅ **findOne** (permitir obtener una sucursal específica)
5. Haz clic en **"Save"**

### 3. Configurar Permisos para "Authenticated" (Usuarios Autenticados)

**Para que usuarios autenticados puedan hacer más operaciones:**

1. En **Settings** → **Users & Permissions Plugin** → **Roles**
2. Haz clic en **"Authenticated"**
3. En la sección **"Permissions"**, busca **"Sucursal"**
4. Marca las siguientes casillas:
   - ✅ **find**
   - ✅ **findOne**
   - ✅ **create** (si quieres que puedan crear)
   - ✅ **update** (si quieres que puedan actualizar)
   - ✅ **delete** (si quieres que puedan eliminar)
5. Haz clic en **"Save"**

### 4. Repetir para Otros Content Types

Haz lo mismo para estos content types que el frontend necesita:

#### **Cajera**
- Public: ✅ find, ✅ findOne
- Authenticated: ✅ find, ✅ findOne, ✅ create, ✅ update, ✅ delete

#### **Cliente**
- Public: ✅ find, ✅ findOne
- Authenticated: ✅ find, ✅ findOne, ✅ create, ✅ update, ✅ delete

#### **Turno**
- Public: ✅ find, ✅ findOne
- Authenticated: ✅ find, ✅ findOne, ✅ create, ✅ update, ✅ delete

#### **Orden**
- Public: ✅ find, ✅ findOne
- Authenticated: ✅ find, ✅ findOne, ✅ create, ✅ update, ✅ delete

#### **Usuario**
- Public: ❌ (no permitir acceso público)
- Authenticated: ✅ find, ✅ findOne (solo para usuarios autenticados)

---

## 🔒 Configuración Recomendada por Seguridad

### Para Producción:

**Public (Solo lectura):**
- ✅ find, ✅ findOne para: Sucursal, Cajera, Cliente, Turno, Orden
- ❌ Todo para: Usuario

**Authenticated (Lectura y escritura):**
- ✅ find, ✅ findOne, ✅ create, ✅ update, ✅ delete para: Sucursal, Cajera, Cliente, Turno, Orden
- ✅ find, ✅ findOne para: Usuario (solo ver, no crear/editar)

---

## ⚠️ Nota Importante

Después de configurar los permisos:
1. **Guarda los cambios** en cada rol
2. **Recarga la página** del frontend
3. El error 403 debería desaparecer

---

## 🐛 Si el Error Persiste

1. **Verifica que estés en la sección correcta:**
   - Settings → Users & Permissions Plugin → Roles
   - NO Settings → Roles (esa es otra sección)

2. **Verifica que los content types estén publicados:**
   - Ve a Content Manager
   - Asegúrate de que las sucursales estén publicadas (no en draft)

3. **Limpia la caché del navegador:**
   - Ctrl + Shift + R (Windows/Linux)
   - Cmd + Shift + R (Mac)

---

## 📝 Resumen Rápido

1. Ve a Strapi Admin → Settings → Users & Permissions Plugin → Roles
2. Configura **Public** con find y findOne para: Sucursal, Cajera, Cliente, Turno, Orden
3. Configura **Authenticated** con todos los permisos para los mismos content types
4. Guarda y recarga el frontend


