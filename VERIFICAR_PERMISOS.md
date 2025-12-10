# Verificar y Configurar Permisos en Strapi

## 🔴 Error Actual
```
API Error: 404 - {"data":null,"error":{"status":404,"name":"NotFoundError","message":"Not Found","details":{}}}
```

## ✅ Solución Paso a Paso

### 1. Abre Strapi Admin
Ve a: http://localhost:1337/admin

### 2. Configura Permisos Públicos

1. En el menú lateral, haz clic en **Settings** (⚙️)
2. Ve a **Users & Permissions Plugin**
3. Haz clic en **Roles**
4. Haz clic en **Public** (el rol público)

### 3. Habilita Permisos para Cada Content Type

Para cada uno de estos, marca las siguientes casillas:

#### 📋 Turno
- ✅ **find** (listar turnos)
- ✅ **findOne** (ver un turno)
- ✅ **update** ← **MUY IMPORTANTE - Este es el que falta**
- ✅ **create** (opcional)

#### 👤 Cliente
- ✅ **find**
- ✅ **findOne**
- ✅ **update** (opcional)
- ✅ **create** (opcional)

#### 🏢 Sucursal
- ✅ **find**
- ✅ **findOne**

#### 👥 Cajera
- ✅ **find**
- ✅ **findOne**

#### 📦 Orden
- ✅ **find**
- ✅ **findOne**

#### 📢 Publicidad
- ✅ **find**
- ✅ **findOne**

### 4. Guarda los Cambios

1. Haz clic en **Save** (botón en la parte superior derecha)
2. Espera a que se guarde (verás un mensaje de confirmación)

### 5. Verifica que Funcione

1. Recarga la página del panel de cajera: http://localhost:3000/cajera
2. Intenta llamar un turno nuevamente
3. Debería funcionar sin el error 404

## 🔍 Verificación Rápida

Puedes verificar que los permisos están bien probando estas URLs en el navegador:

- **Listar turnos**: http://localhost:1337/api/turnos
  - Deberías ver un JSON con los turnos

- **Ver un turno**: http://localhost:1337/api/turnos/1
  - Deberías ver el turno con ID 1

Si estas URLs funcionan, los permisos `find` y `findOne` están bien.
El permiso `update` solo se puede probar haciendo una petición PUT, que es lo que hace el botón "Llamar Turno".

## ⚠️ Si Sigue Sin Funcionar

1. **Verifica que Strapi esté corriendo**: http://localhost:1337/admin
2. **Revisa la consola del navegador** (F12) para ver más detalles del error
3. **Verifica que el turno exista**: Ve a Content Manager > Turno y verifica que haya turnos creados
4. **Reinicia Strapi** si acabas de cambiar los permisos:
   ```bash
   # Detén Strapi (Ctrl+C) y reinícialo
   npm run dev:backend
   ```

## 📝 Nota Importante

En Strapi 5, los permisos deben estar habilitados explícitamente para cada operación. El error 404 generalmente significa que:
- El permiso `update` no está habilitado, O
- El Content Type no existe, O
- El ID del turno no es correcto

La solución más común es habilitar el permiso `update` como se describe arriba.

