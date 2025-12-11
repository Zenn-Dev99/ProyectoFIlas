# ✅ Cómo Configurar Permisos Correctamente en Strapi

## ❌ NO es esto (lo que estás viendo)

Estás en: **Settings → Users & Permissions Plugin → Roles → Public**

Y estás viendo los permisos del **plugin Users-permissions** (AUTH, PERMISSIONS, ROLE, USER).

**Esto NO es lo que necesitas configurar.**

---

## ✅ Lo que SÍ necesitas configurar

Necesitas configurar los permisos de los **Content Types** (Turno, Cliente, Sucursal, etc.).

---

## 📋 Pasos Correctos

### Paso 1: Ve a la Sección Correcta

1. **En el panel de Strapi**, ve a:
   - **Settings** (icono de engranaje en la parte inferior izquierda)
   - **Users & Permissions Plugin**
   - **Roles**
   - **Public** (haz clic en el rol "Public")

### Paso 2: Busca los Content Types

En la página de permisos del rol "Public", deberías ver **dos secciones**:

1. **Plugin Users-permissions** ← Esta NO es la que necesitas
2. **Application** ← **Esta SÍ es la que necesitas**

### Paso 3: Configura los Permisos de Application

En la sección **"Application"**, deberías ver tus Content Types:

- **Turno**
- **Cliente**
- **Sucursal**
- **Cajera**
- **Publicidad**
- **Orden**
- **Usuario**

### Paso 4: Habilita los Permisos

Para cada Content Type que necesites (Turno, Cliente, Sucursal, Cajera, Publicidad):

1. **Expande el Content Type** (haz clic en la flecha o el nombre)
2. **Marca las casillas:**
   - ✅ `find` (para listar/buscar)
   - ✅ `findOne` (para ver un elemento específico)
3. **NO marques** `create`, `update`, `delete` (solo lectura pública)

### Paso 5: Guarda

1. **Haz clic en "Save"** (botón en la parte superior derecha)
2. **Espera a que se guarde** (puede tardar unos segundos)

---

## 🎯 Resumen Visual

```
Settings
  └── Users & Permissions Plugin
      └── Roles
          └── Public
              ├── Plugin Users-permissions ← NO toques esto
              └── Application ← AQUÍ configura los permisos
                  ├── Turno
                  │   ├── ✅ find
                  │   ├── ✅ findOne
                  │   └── ❌ create, update, delete
                  ├── Cliente
                  │   ├── ✅ find
                  │   ├── ✅ findOne
                  │   └── ❌ create, update, delete
                  └── ... (otros Content Types)
```

---

## 🔍 Si No Ves la Sección "Application"

1. **Desplázate hacia abajo** en la página
2. **Busca secciones con nombres de tus Content Types** (Turno, Cliente, etc.)
3. **Puede estar más abajo** en la página

---

## ⚠️ Importante

- **Solo habilita `find` y `findOne`** para los Content Types que el frontend necesita leer
- **NO habilites `create`, `update`, `delete`** a menos que quieras que cualquiera pueda modificar datos
- **Guarda los cambios** después de configurar

---

## 🆘 Si Sigue Dando Error 502

1. **Espera unos minutos** después de guardar
2. **Refresca la página**
3. **Intenta de nuevo**
4. Si persiste, **revisa los logs en Railway** para ver si hay errores del servidor

---

## ✅ Checklist

- [ ] Estás en Settings → Users & Permissions Plugin → Roles → Public
- [ ] Buscaste la sección "Application" (no "Plugin Users-permissions")
- [ ] Encontraste los Content Types (Turno, Cliente, etc.)
- [ ] Habilitaste `find` y `findOne` para cada Content Type necesario
- [ ] Guardaste los cambios
- [ ] No hay errores 502 después de guardar


