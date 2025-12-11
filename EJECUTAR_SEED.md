# 🌱 Ejecutar Seed de Datos

El script de seed (`scripts/seed-datos-prueba.js`) crea datos de prueba en Strapi de forma segura.

## ✅ Características

- **Seguro de ejecutar múltiples veces**: Verifica si ya hay datos antes de crear nuevos
- **Solo se ejecuta si es necesario**: Si ya hay datos, sale inmediatamente sin hacer nada
- **No duplica datos**: Verifica la existencia de cada item antes de crearlo

## 🚀 Cómo Ejecutarlo

### Opción 1: Manualmente (Recomendado para la primera vez)

**Desde la raíz del proyecto:**
```bash
npm run seed
```

**O directamente:**
```bash
node scripts/seed-datos-prueba.js
```

### Opción 2: Automáticamente en Railway (Opcional)

Si quieres que se ejecute automáticamente después del primer deploy en Railway, puedes agregarlo al `startCommand`:

**En `backend/railway.json`:**
```json
{
  "deploy": {
    "startCommand": "mkdir -p public/uploads && node ../../scripts/seed-datos-prueba.js || true && npm start"
  }
}
```

⚠️ **Nota**: El `|| true` asegura que si el seed falla (por ejemplo, si ya hay datos), Strapi seguirá iniciando normalmente.

## 📋 Variables de Entorno

Puedes configurar estas variables si tu Strapi está en otra URL:

```bash
STRAPI_URL=http://localhost:1337  # O la URL de Railway
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin123!
```

## 📦 Datos que Crea

1. **2 Sucursales** (Sucursal Centro y Sucursal Norte)
2. **2 Cajeras** (María González y Juan Pérez)
3. **4 Usuarios** con credenciales simples:
   - `admin` / `admin123` (Jefe General)
   - `jefe1` / `jefe123` (Jefe Sucursal)
   - `cajera1` / `cajera123` (Cajera)
   - `cajera2` / `cajera123` (Cajera)
4. **3 Clientes** (Carlos, Ana, Luis)
5. **2 Órdenes** (ORD-001 y ORD-002)
6. **3 Turnos** (compra, retiro, devolución)

## 🔒 Seguridad

- El script **NO se ejecuta automáticamente** en cada push a Git
- Solo se ejecuta cuando lo llamas manualmente o si lo configuras en Railway
- Verifica la existencia de datos antes de crear nuevos
- No duplica datos si ya existen

## 🐛 Solución de Problemas

### Error: "Login failed"
- Verifica que Strapi esté corriendo
- Verifica las credenciales de admin en las variables de entorno
- Asegúrate de haber creado una cuenta de administrador en Strapi

### El script dice "Ya existen datos"
- Esto es normal si ya ejecutaste el seed antes
- El script detecta datos existentes y sale sin hacer nada
- Si quieres ejecutarlo de nuevo, elimina los datos existentes primero

### No se crean los datos
- Verifica que los permisos en Strapi estén configurados correctamente
- Asegúrate de que el usuario admin tenga permisos para crear contenido
- Revisa los logs para ver errores específicos

