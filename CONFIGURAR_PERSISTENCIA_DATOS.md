# 💾 Configurar Persistencia de Datos en Railway

## 📋 Problema

Por defecto, Railway usa volúmenes efímeros. Si usas SQLite, los datos se borran en cada redeploy. Para tener persistencia, necesitas usar **PostgreSQL**.

## ✅ Solución: Usar PostgreSQL en Railway

PostgreSQL en Railway es un servicio separado que persiste los datos incluso cuando el servicio de Strapi se redespliega.

---

## 🔧 Paso 1: Agregar Base de Datos PostgreSQL

### 1.1 En Railway:

1. Ve a tu proyecto en Railway
2. Haz clic en **"New"** → **"Database"** → **"Add PostgreSQL"**
3. Railway creará automáticamente una base de datos PostgreSQL
4. Railway inyectará automáticamente la variable `DATABASE_URL` en tu servicio Backend

---

## 🔧 Paso 2: Configurar Variables de Entorno

### 2.1 En tu Servicio Backend:

Ve a **Variables** y configura:

**IMPORTANTE:** Railway automáticamente inyecta `DATABASE_URL` cuando agregas PostgreSQL. Solo necesitas configurar:

```env
# Base de datos (IMPORTANTE: usar postgres, no sqlite)
DATABASE_CLIENT=postgres
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

**Nota:** `${{Postgres.DATABASE_URL}}` es una referencia a la variable que Railway inyecta automáticamente. Si no ves esta variable, significa que PostgreSQL no está conectado al servicio.

### 2.2 Conectar PostgreSQL al Servicio Backend:

1. En Railway, haz clic en tu servicio **PostgreSQL**
2. Ve a la pestaña **"Variables"**
3. Busca `DATABASE_URL` y cópiala
4. Ve a tu servicio **Backend** → **Variables**
5. Agrega:
   - **Nombre:** `DATABASE_URL`
   - **Valor:** Pega el valor que copiaste
   - **O usa la referencia:** `${{Postgres.DATABASE_URL}}`

**O más fácil:**
- Railway debería detectar automáticamente la conexión
- Si no, en el servicio Backend, busca **"Connect"** o **"Add Service"** y selecciona PostgreSQL

### 2.3 Otras Variables Necesarias:

```env
# Otras variables de Strapi (ya deberías tenerlas)
NODE_ENV=production
HOST=0.0.0.0
PORT=${{PORT}}
CORS_ORIGIN=*

APP_KEYS=tu_app_keys_aqui
API_TOKEN_SALT=tu_api_token_salt_aqui
ADMIN_JWT_SECRET=tu_admin_jwt_secret_aqui
TRANSFER_TOKEN_SALT=tu_transfer_token_salt_aqui
JWT_SECRET=tu_jwt_secret_aqui
ENCRYPTION_KEY=tu_encryption_key_aqui
```

---

## 🔧 Paso 3: Verificar la Conexión

### 3.1 Después del Deploy:

1. Ve a tu servicio Backend en Railway
2. Revisa los **Logs**
3. Deberías ver mensajes como:
   ```
   Database connection has been established successfully
   ```

Si ves errores de conexión, verifica que:
- `DATABASE_CLIENT=postgres` esté configurado
- `DATABASE_URL` esté presente (Railway lo inyecta automáticamente)

---

## 🚫 Paso 4: Seed Automático Desactivado

El seed automático **ya está deshabilitado** en el código. No se ejecutará automáticamente en cada deploy.

### 4.1 Ejecutar Seed Manualmente (Solo una vez):

Después de configurar PostgreSQL, ejecuta el seed **una sola vez** para poblar los datos iniciales:

**Opción A: Desde tu máquina local**

```bash
# Configurar variables
$env:STRAPI_URL="https://proyectofilas-production.up.railway.app"
$env:STRAPI_API_TOKEN="tu_token_aqui"

# Ejecutar seed
node scripts/seed-datos-prueba.js
```

**Opción B: Usando Railway CLI**

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Conectar al proyecto
railway link

# Ejecutar seed en el servicio backend
railway run --service backend node ../scripts/seed-datos-prueba.js
```

**⚠️ IMPORTANTE:** Solo ejecuta el seed **una vez** después de configurar PostgreSQL. Los datos persistirán en todos los redeploys.

---

## ✅ Resultado

Después de configurar PostgreSQL:

1. **Los datos persisten** entre redeploys
2. **No necesitas crear el admin cada vez** - los usuarios se mantienen
3. **No necesitas ejecutar el seed cada vez** - los datos se mantienen
4. **Puedes hacer redeploys sin perder datos**

---

## 🔍 Verificar que Funciona

1. **Crea algunos datos** en Strapi (usuarios, sucursales, etc.)
2. **Haz un redeploy** del servicio Backend
3. **Verifica que los datos sigan ahí** - deberían persistir

---

## ⚠️ Notas Importantes

1. **PostgreSQL es un servicio separado** en Railway - tiene su propio costo
2. **Los datos se mantienen** incluso si eliminas y recreas el servicio Backend
3. **Para eliminar los datos**, necesitas eliminar el servicio PostgreSQL
4. **Backups**: Railway hace backups automáticos de PostgreSQL

---

## 📚 Referencias

- [Railway PostgreSQL Documentation](https://docs.railway.app/databases/postgresql)
- [Strapi Database Configuration](https://docs.strapi.io/dev-docs/configurations/database)

