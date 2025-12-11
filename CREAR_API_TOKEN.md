# 🔑 Crear API Token en Strapi

## ⚠️ Si la Interfaz de Strapi Tiene Errores

Si ves el error **"Cannot read properties of undefined (reading 'invalidatesTags')"** al intentar crear un token desde la interfaz, usa el script automático:

### ✅ Opción Rápida: Script Automático

```powershell
# Configurar variables
$env:STRAPI_URL="https://proyectofilas-production.up.railway.app"
$env:ADMIN_EMAIL="tu_email_de_admin"
$env:ADMIN_PASSWORD="tu_password_de_admin"

# Ejecutar script
node scripts/crear-api-token.js
```

El script:
- ✅ Hace login como admin
- ✅ Crea el API Token automáticamente
- ✅ Te muestra el token (cópialo inmediatamente)
- ✅ Lo guarda en `api-token.json`

**⚠️ IMPORTANTE:** El token solo se muestra una vez. Guárdalo en un lugar seguro.

---

## 📋 Método Manual (Si la Interfaz Funciona)

### Pasos para Crear el Token

1. **Abre el panel de admin de Strapi:**
   - Ve a: `https://proyectofilas-production.up.railway.app/admin`
   - Inicia sesión con tus credenciales de admin

2. **Ve a Settings → API Tokens:**
   - En el menú lateral, busca **Settings**
   - Haz clic en **API Tokens**

3. **Crea un nuevo token:**
   - Haz clic en **"Create new API Token"**
   - **Token name:** `Seed Script` (o cualquier nombre)
   - **Token duration:** `Unlimited` (o el tiempo que prefieras)
   - **Token type:** Selecciona **"Full access"**
   - Haz clic en **"Save"**

4. **Copia el token:**
   - ⚠️ **IMPORTANTE:** Copia el token inmediatamente, solo se muestra una vez
   - Guárdalo en un lugar seguro

---

## 🚀 Usar el Token para el Seed

Una vez que tengas el token:

```powershell
$env:STRAPI_URL="https://proyectofilas-production.up.railway.app"
$env:STRAPI_API_TOKEN="tu_token_aqui"
node scripts/seed-datos-prueba.js
```

---

## 💡 Ventajas del API Token

- ✅ No necesitas credenciales de admin cada vez
- ✅ Más seguro que usar password
- ✅ Funciona incluso si cambias la contraseña de admin
- ✅ Puedes revocarlo cuando quieras

## 🔒 Seguridad

- No compartas el token públicamente
- Si lo expones, revócalo y crea uno nuevo
- Usa tokens con duración limitada si es posible
