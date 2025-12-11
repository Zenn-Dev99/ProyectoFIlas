# 🌱 Configurar Seed Automático en Railway

## 📋 Descripción

El seed automático se ejecuta cada vez que Strapi inicia en producción. Solo se ejecuta si no hay datos en el sistema, evitando duplicados.

## ✅ Cambios Realizados

1. **Script de seed automático**: `backend/src/bootstrap/seed.ts`
   - Se ejecuta automáticamente al iniciar Strapi
   - Solo se ejecuta si no hay datos en el sistema
   - Crea: sucursales, cajeras, usuarios, clientes, órdenes y turnos

2. **Relaciones corregidas**:
   - Turno ahora usa la relación `orden` en lugar de `ordenId` (string)
   - Frontend actualizado para usar `orden?.numeroOrden` con compatibilidad hacia atrás

3. **Bootstrap actualizado**: `backend/src/index.ts`
   - Llama al seed automático después de registrar las rutas

## 🔧 Configuración en Railway

### 1. Agregar Variable de Entorno

En Railway, para el servicio **Backend**, agrega esta variable de entorno:

```
AUTO_SEED=true
```

**Pasos:**
1. Ve a tu proyecto en Railway
2. Selecciona el servicio **Backend**
3. Ve a la pestaña **Variables**
4. Haz clic en **+ New Variable**
5. Nombre: `AUTO_SEED`
6. Valor: `true`
7. Haz clic en **Add**

### 2. Verificar Otras Variables

Asegúrate de que también tengas configuradas:
- `NODE_ENV=production`
- Todas las variables de Strapi (APP_KEYS, ADMIN_JWT_SECRET, etc.)

## 🔄 Cómo Funciona

1. **Al iniciar Strapi en producción:**
   - El script verifica si `AUTO_SEED=true` o `NODE_ENV=production`
   - Espera 2 segundos para que Strapi se inicialice completamente
   - Verifica si ya hay datos (busca sucursales)
   - Si no hay datos, ejecuta el seed automáticamente

2. **Datos creados:**
   - 2 Sucursales (Centro y Norte)
   - 2 Cajeras (María González y Juan Pérez)
   - 4 Usuarios:
     - `jefe_general_1` / `admin123`
     - `jefe_sucursal_1` / `jefe123`
     - `cajera_1` / `cajera123`
     - `cajera_2` / `cajera123`
   - 3 Clientes
   - 2 Órdenes
   - 3 Turnos

## 📝 Credenciales de Prueba

Después del seed automático, puedes usar estas credenciales:

```
👑 Jefe General:
   Usuario: jefe_general_1
   Password: admin123

👔 Jefe Sucursal:
   Usuario: jefe_sucursal_1
   Password: jefe123

👤 Cajeras:
   Usuario: cajera_1 / Password: cajera123
   Usuario: cajera_2 / Password: cajera123
```

## ⚠️ Notas Importantes

1. **Solo se ejecuta una vez**: El seed verifica si ya hay datos antes de ejecutarse
2. **En cada redeploy**: Si la base de datos se borra, el seed se ejecutará automáticamente
3. **No sobrescribe datos**: Si ya hay datos, el seed no se ejecuta

## 🐛 Solución de Problemas

### El seed no se ejecuta

1. Verifica que `AUTO_SEED=true` esté configurado en Railway
2. Verifica los logs de Railway para ver si hay errores
3. Verifica que `NODE_ENV=production` esté configurado

### Errores en el seed

1. Revisa los logs de Railway
2. Verifica que los permisos de los content types estén configurados
3. Verifica que las relaciones entre tablas estén correctas

## 🔍 Verificar que Funcionó

1. Después de un deploy, revisa los logs de Railway
2. Deberías ver mensajes como:
   ```
   🌱 Iniciando seed automático de datos de prueba...
   📍 Creando sucursales...
   ✅ Sucursal creada: Sucursal Centro
   ...
   ✅ Seed completado exitosamente!
   ```

3. Intenta hacer login con las credenciales de prueba

## 📚 Relaciones de Tablas

### Relaciones Configuradas:

- **Sucursal** → **Cajera** (oneToMany)
- **Sucursal** → **Usuario** (oneToMany)
- **Sucursal** → **Turno** (oneToMany)
- **Cajera** → **Turno** (oneToMany)
- **Cajera** → **Usuario** (oneToOne)
- **Cliente** → **Turno** (oneToMany)
- **Cliente** → **Orden** (oneToMany)
- **Orden** → **Turno** (oneToMany)

Todas las relaciones están correctamente configuradas en los schemas.

