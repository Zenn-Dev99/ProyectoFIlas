# 🔐 Credenciales de Acceso - Fila Suite

Este documento contiene las credenciales de acceso para los usuarios de prueba del sistema.

## 👑 Jefes Generales

Los jefes generales pueden ver y gestionar **todas las sucursales**.

### Jefe General 1
- **Usuario:** `jefe_general_1`
- **Contraseña:** `jefe123`
- **Nombre:** Carlos Administrador
- **Email:** jefe.general1@fila-suite.com
- **Rol:** Jefe General

### Jefe General 2
- **Usuario:** `jefe_general_2`
- **Contraseña:** `jefe123`
- **Nombre:** Ana Directora
- **Email:** jefe.general2@fila-suite.com
- **Rol:** Jefe General

---

## 👔 Jefes de Sucursal

Los jefes de sucursal pueden ver y gestionar **solo su sucursal asignada**.

### Jefe Sucursal Principal
- **Usuario:** `jefe_sucursal_suc_001`
- **Contraseña:** `jefe123`
- **Nombre:** Jefe Sucursal Principal
- **Email:** jefe.suc.001@fila-suite.com
- **Rol:** Jefe de Sucursal
- **Sucursal:** Sucursal Principal

> **Nota:** Se creará un jefe de sucursal por cada sucursal existente en el sistema. El nombre de usuario seguirá el patrón: `jefe_sucursal_[codigo_sucursal]`

---

## 👤 Cajeras

Las cajeras pueden acceder solo al panel de cajera para gestionar turnos.

> **Nota:** Las cajeras se crean desde el panel de administración y no tienen credenciales de acceso al sistema de administración.

---

## 🔄 Crear Usuarios de Prueba

Para crear o actualizar los usuarios de prueba, ejecuta:

```bash
node scripts/crear-usuarios-prueba.js
```

**Requisitos:**
- Strapi debe estar corriendo en `http://localhost:1337`
- Necesitas un token de API con permisos "Full access"
- Obtén el token en: `http://localhost:1337/admin/settings/api-tokens`

**Ejecutar con token:**
```bash
STRAPI_API_TOKEN=tu_token node scripts/crear-usuarios-prueba.js
```

---

## 📝 Notas de Seguridad

⚠️ **IMPORTANTE:** Estas credenciales son solo para desarrollo y pruebas. En producción:

1. Cambia todas las contraseñas por defecto
2. Implementa políticas de contraseñas seguras
3. Habilita autenticación de dos factores (2FA)
4. Revisa y ajusta los permisos de cada rol
5. No compartas estas credenciales en repositorios públicos

---

## 🎯 Permisos por Rol

### Jefe General
- ✅ Ver todas las sucursales
- ✅ Cambiar entre sucursales
- ✅ Gestionar turnos de todas las sucursales
- ✅ Gestionar cajeras de todas las sucursales
- ✅ Ver estadísticas de todas las sucursales
- ✅ Crear y eliminar cajeras

### Jefe de Sucursal
- ✅ Ver solo su sucursal asignada
- ❌ No puede cambiar de sucursal
- ✅ Gestionar turnos de su sucursal
- ✅ Gestionar cajeras de su sucursal
- ✅ Ver estadísticas de su sucursal
- ✅ Crear y eliminar cajeras de su sucursal

### Cajera
- ✅ Acceder al panel de cajera
- ✅ Ver turnos asignados a su sucursal
- ✅ Llamar y gestionar turnos
- ❌ No puede acceder al panel de administración

---

## 🔗 URLs de Acceso

- **Login:** `http://localhost:3000/login`
- **Dashboard Admin:** `http://localhost:3000/admin`
- **Panel Cajera:** `http://localhost:3000/cajera/inicio`
- **Pantalla TV:** `http://localhost:3000/tv`

---

**Última actualización:** Generado automáticamente al ejecutar el script de creación de usuarios.

