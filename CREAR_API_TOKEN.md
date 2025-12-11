# 🔑 Crear API Token en Strapi para el Seed

## 📋 Pasos para Crear el Token

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

5. **Ejecuta el seed:**
   ```powershell
   $env:STRAPI_URL="https://proyectofilas-production.up.railway.app"
   $env:STRAPI_API_TOKEN="tu_token_aqui"
   node scripts/seed-datos-prueba.js
   ```

## 💡 Ventajas del API Token

- ✅ No necesitas credenciales de admin cada vez
- ✅ Más seguro que usar password
- ✅ Funciona incluso si cambias la contraseña de admin
- ✅ Puedes revocarlo cuando quieras

## 🔒 Seguridad

- No compartas el token públicamente
- Si lo expones, revócalo y crea uno nuevo
- Usa tokens con duración limitada si es posible

