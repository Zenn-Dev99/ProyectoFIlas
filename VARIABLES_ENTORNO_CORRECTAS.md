# ✅ Variables de Entorno Correctas para Railway

## 📋 Variables Corregidas (SIN comillas)

Copia y pega estas variables exactamente como están (sin comillas):

```env
DATABASE_CLIENT=postgres
DATABASE_URL=${{Postgres.DATABASE_URL}}
NODE_ENV=production
HOST=0.0.0.0
CORS_ORIGIN=*
APP_KEYS=pwcdmAPEYnLjk6VLdcp085Ng/BVrReGgmGDVKuOXILY=,tIQ9/RG4qMy0xrYzv2VHDz4OOkDiALim+azQOcvymmQ=,elrHlqSJm6DgXm4oxw8DavQV/+RG5oxNjnQPcUzk78Q=,QmFU/kQwNkvkni70HVlhbmScULBLqoeRgqVeLYT1fi4=
API_TOKEN_SALT=+0VJogGmisHb4UfqcJJWVGppei7YTYFLzdos13wPSYs=
ADMIN_JWT_SECRET=cjy0vWxDv2HySVlhry8mU9bYfmfQWfpazNwIseZ5zCQ=
TRANSFER_TOKEN_SALT=a8AebvBO1zZ6UJgq0AKSnfiGkyZWGTf6KMVcOw0vd2g=
JWT_SECRET=EZq7rtv5+r5kPYnM8/HFvvcpIkVqj4XQQ61kfxvlL0A=
ENCRYPTION_KEY=pwcdmAPEYnLjk6VLdcp085Ng/BVrReGgmGDVKuOXILY=
AUTO_SEED=false
```

## ⚠️ Cambios Realizados

1. **Removidas todas las comillas** - Railway no las necesita
2. **DATABASE_URL** - Sin comillas (la referencia `${{Postgres.DATABASE_URL}}` funciona sin comillas)
3. **CORS_ORIGIN** - Cambiado de `"*"` a `*` (sin comillas)
4. **AUTO_SEED** - Cambiado de `"false"` a `false` (sin comillas)

## 🔧 Cómo Aplicar en Railway

1. Ve a Railway → Tu servicio **Backend**
2. Haz clic en **"Variables"**
3. Para cada variable:
   - Si existe, haz clic en ella y **edita el valor** (quita las comillas)
   - Si no existe, haz clic en **"New Variable"** y agrega el valor sin comillas

## 📝 Ejemplo Visual

**❌ INCORRECTO:**
```
DATABASE_URL="${{Postgres.DATABASE_URL}}"
CORS_ORIGIN="*"
AUTO_SEED="false"
```

**✅ CORRECTO:**
```
DATABASE_URL=${{Postgres.DATABASE_URL}}
CORS_ORIGIN=*
AUTO_SEED=false
```

## 🎯 Variables Especiales

### DATABASE_URL
- **Formato:** `${{Postgres.DATABASE_URL}}` (sin comillas)
- **O si la referencia no funciona:** Copia el valor directo del servicio PostgreSQL

### APP_KEYS
- Es una lista separada por comas
- No necesita comillas aunque tenga caracteres especiales

### CORS_ORIGIN
- Si es un solo valor: `*` (sin comillas)
- Si son múltiples: `https://dominio1.com,https://dominio2.com` (sin comillas)

## ✅ Después de Corregir

1. **Guarda los cambios** en Railway
2. **Haz un Redeploy** del servicio Backend
3. **Revisa los logs** - Deberías ver:
   - `✅ DATABASE_URL encontrado`
   - `🚀 Strapi iniciado correctamente`
   - `✅ Base de datos conectada`

## 💡 Tip

Si después de quitar las comillas sigue fallando, prueba copiar el valor directo de `DATABASE_URL` del servicio PostgreSQL en lugar de usar la referencia `${{Postgres.DATABASE_URL}}`.

