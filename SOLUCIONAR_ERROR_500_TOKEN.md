# 🔧 Solucionar Error 500 al Crear API Token

## ❌ Problema

Error 500 al intentar hacer login o crear el token. Esto generalmente indica un problema con la base de datos.

## ✅ Soluciones

### 1. Verificar que PostgreSQL esté Configurado

En Railway:

1. **Verifica que tengas PostgreSQL agregado:**
   - Ve a tu proyecto en Railway
   - Deberías ver un servicio llamado "Postgres" o similar
   - Si no lo tienes, agrégalo: **New** → **Database** → **Add PostgreSQL**

2. **Verifica las variables de entorno en el servicio Backend:**
   - Ve a tu servicio Backend → **Variables**
   - Debe tener:
     ```
     DATABASE_CLIENT=postgres
     DATABASE_URL=${{Postgres.DATABASE_URL}}
     ```
   - O si no funciona la referencia, copia directamente el valor de `DATABASE_URL` del servicio PostgreSQL

### 2. Revisar los Logs de Railway

1. Ve a tu servicio Backend en Railway
2. Haz clic en **"Logs"**
3. Busca errores relacionados con:
   - `Cannot find module 'pg'` → Ya lo arreglamos
   - `Connection refused` → PostgreSQL no está conectado
   - `Database connection failed` → Verifica `DATABASE_URL`

### 3. Verificar que el Servicio esté Corriendo

1. En Railway, verifica que el servicio Backend tenga estado **"Active"**
2. Si está en estado de error, haz clic en **"Redeploy"**

### 4. Alternativa: Crear Admin desde Railway CLI

Si el servidor está funcionando pero el login falla, puedes crear un nuevo admin:

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Conectar al proyecto
railway link

# Crear admin
railway run --service backend npm run strapi admin:create-user
```

### 5. Verificar Credenciales

Si PostgreSQL está bien configurado pero el login sigue fallando:

1. Verifica que el usuario admin exista
2. Si no existe, créalo usando el método del paso 4
3. O verifica en los logs de Railway si hay un mensaje con las credenciales iniciales

---

## 🎯 Después de Solucionar

Una vez que el servidor esté funcionando correctamente:

```powershell
$env:STRAPI_URL="https://proyectofilas-production.up.railway.app"
$env:ADMIN_EMAIL="martininfantezuniga@gmail.com"
$env:ADMIN_PASSWORD="Martin1+"
node scripts/crear-api-token.js
```

---

## 📋 Checklist

- [ ] PostgreSQL está agregado en Railway
- [ ] `DATABASE_CLIENT=postgres` está configurado
- [ ] `DATABASE_URL` está configurado y es válido
- [ ] El servicio Backend está corriendo (estado "Active")
- [ ] No hay errores en los logs relacionados con la base de datos
- [ ] El usuario admin existe y las credenciales son correctas

