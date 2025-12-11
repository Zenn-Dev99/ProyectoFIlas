# 🔧 Solucionar Errores SSL de PostgreSQL

## ❌ Problema

Los logs muestran errores de SSL al conectar a PostgreSQL:

```
received direct SSL connection request without ALPN protocol negotiation extension
invalid length of startup packet
could not accept SSL connection: version too low
```

Esto indica que la configuración SSL no es compatible con Railway PostgreSQL.

## ✅ Solución

Railway PostgreSQL requiere SSL pero con una configuración específica. He actualizado `backend/config/database.ts` para usar la configuración correcta.

### Cambios Realizados

1. **Configuración SSL mejorada:**
   - `rejectUnauthorized: false` - Permite certificados autofirmados
   - `require: true` - Requiere SSL pero es flexible con la versión

2. **Solo en producción:**
   - SSL solo se activa cuando `NODE_ENV=production`
   - En desarrollo local, SSL está deshabilitado

## 🔍 Verificar Configuración

Después del redeploy, los logs deberían mostrar:

```
🔍 Configuración de Base de Datos:
   Client: postgres
   ✅ DATABASE_URL encontrado
   Host: postgres.railway.internal
   Database: railway
```

Y **NO** deberías ver más errores de SSL.

## 📋 Si Sigue Fallando

Si después del cambio sigues viendo errores SSL:

1. **Verifica DATABASE_URL:**
   - Debe ser: `postgresql://usuario:password@host:puerto/database`
   - Railway lo proporciona automáticamente

2. **Verifica que DATABASE_CLIENT=postgres:**
   - En Railway → Backend → Variables

3. **Prueba con sslmode en la URL:**
   - Si la configuración de objeto no funciona, puedes agregar `?sslmode=require` al final de `DATABASE_URL`
   - Pero esto generalmente no es necesario

## 🎯 Resultado Esperado

Después de la corrección:
- ✅ No más errores de SSL
- ✅ Conexión exitosa a PostgreSQL
- ✅ Strapi inicia correctamente
- ✅ Logs muestran "✅ Base de datos conectada"

