# 🔍 Diagnosticar Problemas del Backend

## 📋 Checklist de Diagnóstico

### 1. Verificar Variables de Entorno

En Railway → Backend → Variables, verifica:

```env
DATABASE_CLIENT=postgres
DATABASE_URL=${{Postgres.DATABASE_URL}}
NODE_ENV=production
HOST=0.0.0.0
```

**⚠️ IMPORTANTE:**
- `DATABASE_URL` debe ser solo `${{Postgres.DATABASE_URL}}` (sin comillas, sin URL completa)
- Si la referencia no funciona, copia el valor directo del servicio PostgreSQL

### 2. Revisar Logs de Deploy

En Railway → Backend → Deploy Logs, busca:

**✅ Logs esperados:**
- `🔍 Configuración de Base de Datos`
- `✅ DATABASE_URL encontrado`
- `🔧 Iniciando bootstrap de Strapi...`
- `🚀 Strapi iniciado correctamente`
- `✅ Base de datos conectada`

**❌ Errores comunes:**
- `⚠️ DATABASE_URL no encontrado` → Falta la variable
- `AggregateError` → Problema de conexión a PostgreSQL
- `ECONNREFUSED` → PostgreSQL no está disponible
- `password authentication failed` → Credenciales incorrectas

### 3. Verificar que PostgreSQL esté Online

1. Ve al servicio PostgreSQL en Railway
2. Debe estar en estado **"Online"**
3. Si está en error, haz clic en **"Redeploy"**

### 4. Verificar el Formato de DATABASE_URL

El formato correcto es:
```
postgresql://usuario:password@host:puerto/database
```

O para Railway:
```
postgresql://postgres:password@postgres.railway.internal:5432/railway
```

### 5. Probar Conexión Manualmente

Si tienes Railway CLI:

```bash
railway run --service backend node -e "
const { Client } = require('pg');
const client = new Client({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
client.connect()
  .then(() => {
    console.log('✅ Conexión exitosa');
    return client.query('SELECT NOW()');
  })
  .then(res => {
    console.log('✅ Query exitosa:', res.rows[0]);
    client.end();
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
"
```

---

## 🔧 Soluciones Comunes

### Problema: "DATABASE_URL no encontrado"

**Solución:**
1. Ve a PostgreSQL → Variables
2. Copia el valor de `DATABASE_URL`
3. Pégalo en Backend → Variables como `DATABASE_URL`
4. O usa la referencia: `${{Postgres.DATABASE_URL}}`

### Problema: "AggregateError"

**Solución:**
1. Verifica que PostgreSQL esté "Online"
2. Verifica que `DATABASE_URL` esté correcto
3. Verifica que `DATABASE_CLIENT=postgres` esté configurado

### Problema: "Connection timeout"

**Solución:**
1. Verifica que PostgreSQL esté "Online"
2. Verifica que `DATABASE_URL` use el host correcto
3. Para Railway, debe ser `postgres.railway.internal` o el host que Railway proporciona

### Problema: Contenedor se detiene inmediatamente

**Posibles causas:**
1. Error en bootstrap que hace que Strapi se cierre
2. Error de conexión a BD que hace que Strapi falle
3. Variables de entorno faltantes (APP_KEYS, etc.)

**Solución:**
1. Revisa los logs completos (no solo los últimos)
2. Busca errores antes de "Stopping Container"
3. Verifica todas las variables de entorno requeridas

---

## 📊 Logs Detallados

Los nuevos logs muestran:
- ✅ Configuración de BD al iniciar
- ✅ Estado de DATABASE_URL
- ✅ Proceso de bootstrap paso a paso
- ✅ Errores detallados con stack traces

Revisa estos logs para identificar exactamente dónde falla.

