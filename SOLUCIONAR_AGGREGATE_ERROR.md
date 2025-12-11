# 🔧 Solucionar AggregateError en Strapi

## ❌ Problema

El servidor muestra `AggregateError` repetidamente y se cierra. Esto generalmente indica un problema con la conexión a PostgreSQL.

## 🔍 Diagnóstico

El `AggregateError` en Strapi generalmente ocurre cuando:
1. **No puede conectarse a PostgreSQL** - `DATABASE_URL` incorrecto o no configurado
2. **Credenciales incorrectas** - Usuario/contraseña de PostgreSQL incorrectos
3. **Base de datos no existe** - La base de datos especificada no existe
4. **PostgreSQL no está disponible** - El servicio PostgreSQL no está corriendo

## ✅ Soluciones

### 1. Verificar que PostgreSQL esté Configurado

En Railway:

1. **Verifica que tengas PostgreSQL:**
   - Ve a tu proyecto en Railway
   - Deberías ver un servicio "Postgres" o similar
   - Debe estar en estado **"Online"**

2. **Si no tienes PostgreSQL:**
   - Haz clic en **"New"** → **"Database"** → **"Add PostgreSQL"**
   - Railway creará automáticamente la base de datos

### 2. Verificar Variables de Entorno

En tu servicio Backend → Variables:

**Variables REQUERIDAS:**
```env
# Base de datos
DATABASE_CLIENT=postgres
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Strapi
NODE_ENV=production
HOST=0.0.0.0
PORT=${{PORT}}  # Railway lo inyecta automáticamente

# Secrets de Strapi (genera nuevos si no los tienes)
APP_KEYS=tu_app_keys_aqui
API_TOKEN_SALT=tu_api_token_salt_aqui
ADMIN_JWT_SECRET=tu_admin_jwt_secret_aqui
TRANSFER_TOKEN_SALT=tu_transfer_token_salt_aqui
JWT_SECRET=tu_jwt_secret_aqui
ENCRYPTION_KEY=tu_encryption_key_aqui
```

**⚠️ IMPORTANTE:**
- `DATABASE_URL` debe ser la referencia `${{Postgres.DATABASE_URL}}`
- O copia directamente el valor de `DATABASE_URL` del servicio PostgreSQL

### 3. Verificar la Conexión a PostgreSQL

Si `DATABASE_URL` está configurado pero sigue fallando:

1. **Copia el valor real de DATABASE_URL:**
   - Ve al servicio PostgreSQL → Variables
   - Copia el valor de `DATABASE_URL`
   - Pégalo directamente en el servicio Backend (en lugar de la referencia)

2. **Verifica el formato:**
   - Debe ser: `postgresql://usuario:password@host:puerto/database`
   - O: `postgres://usuario:password@host:puerto/database`

### 4. Verificar Logs de PostgreSQL

En Railway:

1. Ve al servicio PostgreSQL → Logs
2. Busca errores como:
   - `Connection refused`
   - `Authentication failed`
   - `Database does not exist`

### 5. Probar Conexión Manualmente

Si tienes acceso a Railway CLI:

```bash
railway run --service backend node -e "
const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL });
client.connect()
  .then(() => console.log('✅ Conexión exitosa'))
  .catch(err => console.error('❌ Error:', err.message))
  .finally(() => client.end());
"
```

### 6. Verificar que el Servicio PostgreSQL esté Online

1. En Railway, verifica que el servicio PostgreSQL tenga estado **"Online"**
2. Si está en estado de error, haz clic en **"Redeploy"**

### 7. Revisar Logs Mejorados

Los logs ahora muestran más información:
- `🔍 Configuración de Base de Datos` - Muestra qué cliente se está usando
- `✅ DATABASE_URL encontrado` - Confirma que la variable está configurada
- `❌ AggregateError - Múltiples errores` - Muestra los errores específicos

---

## 📋 Checklist

- [ ] Servicio PostgreSQL existe y está "Online"
- [ ] `DATABASE_CLIENT=postgres` está configurado
- [ ] `DATABASE_URL` está configurado (referencia o valor directo)
- [ ] `NODE_ENV=production` está configurado
- [ ] `HOST=0.0.0.0` está configurado
- [ ] Todos los secrets de Strapi están configurados
- [ ] No hay errores en los logs de PostgreSQL
- [ ] El formato de `DATABASE_URL` es correcto

---

## 🔍 Errores Comunes y Soluciones

### Error: "ECONNREFUSED"
**Causa:** No se puede conectar a PostgreSQL
**Solución:** Verifica que `DATABASE_URL` esté correcto y que PostgreSQL esté online

### Error: "password authentication failed"
**Causa:** Credenciales incorrectas
**Solución:** Verifica que `DATABASE_URL` tenga las credenciales correctas

### Error: "database does not exist"
**Causa:** La base de datos no existe
**Solución:** Railway crea la BD automáticamente, verifica que el servicio PostgreSQL esté configurado

### Error: "Connection timeout"
**Causa:** PostgreSQL no está respondiendo
**Solución:** Verifica que el servicio PostgreSQL esté "Online" en Railway

---

## 💡 Si Nada Funciona

1. **Elimina y recrea el servicio PostgreSQL:**
   - Esto puede resolver problemas de configuración

2. **Usa SQLite temporalmente para probar:**
   - Cambia `DATABASE_CLIENT=sqlite` (solo para testing)
   - Si funciona, el problema es PostgreSQL

3. **Contacta soporte de Railway:**
   - Si el problema persiste, puede ser un issue de Railway

---

## 🎯 Después de Solucionar

Una vez que el servidor inicie correctamente, deberías ver en los logs:
- ✅ `🔍 Configuración de Base de Datos`
- ✅ `✅ DATABASE_URL encontrado`
- ✅ `🚀 Strapi iniciado correctamente`
- ✅ `✅ Base de datos conectada`

