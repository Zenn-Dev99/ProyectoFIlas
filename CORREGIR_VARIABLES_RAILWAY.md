# 🔧 Corregir Variables de Entorno en Railway

## ❌ Problema Detectado

Tu `DATABASE_URL` está mal configurado:

```
DATABASE_URL="${{Postgres.postgresql://postgres:otCbBcaTGQwxXAQPTKCZFXWNxqbqNGgq@postgres.railway.internal:5432/railway}}"
```

Esto está **incorrecto**. Estás mezclando la referencia de Railway con la URL completa.

## ✅ Solución

Tienes **dos opciones**:

### Opción 1: Usar Referencia de Railway (Recomendado)

Usa solo la referencia, Railway la resuelve automáticamente:

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

**⚠️ IMPORTANTE:**
- Sin comillas
- Sin la URL completa dentro
- Solo la referencia `${{Postgres.DATABASE_URL}}`

### Opción 2: Usar URL Directa

Si la referencia no funciona, usa la URL completa directamente:

```
DATABASE_URL=postgresql://postgres:otCbBcaTGQwxXAQPTKCZFXWNxqbqNGgq@postgres.railway.internal:5432/railway
```

**⚠️ IMPORTANTE:**
- Sin comillas
- Sin la referencia `${{...}}`
- URL completa directamente

---

## 📋 Variables Corregidas

Aquí están tus variables **corregidas**:

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

**Cambios realizados:**
1. ✅ `DATABASE_URL` - Corregido (sin comillas, solo referencia)
2. ✅ `DATABASE_CLIENT` - Removidas comillas (no son necesarias)
3. ✅ `NODE_ENV` - Removidas comillas
4. ✅ `HOST` - Removidas comillas
5. ✅ `CORS_ORIGIN` - Removidas comillas
6. ✅ `AUTO_SEED` - Cambiado a `false` (habíamos deshabilitado el seed automático)

---

## 🔧 Cómo Aplicar en Railway

1. Ve a tu servicio **Backend** en Railway
2. Haz clic en **"Variables"**
3. Para cada variable:
   - Si existe, haz clic en ella y edita el valor
   - Si no existe, haz clic en **"New Variable"**
4. **IMPORTANTE:** Al pegar los valores, **NO agregues comillas** a menos que el valor mismo las necesite
5. Guarda los cambios

---

## ⚠️ Notas Importantes

1. **Sin comillas:** Railway no necesita comillas en las variables de entorno (a menos que el valor mismo las contenga)
2. **DATABASE_URL:** Usa la referencia `${{Postgres.DATABASE_URL}}` si es posible, es más seguro
3. **AUTO_SEED:** Lo dejé en `false` porque habíamos deshabilitado el seed automático. Si quieres que se ejecute automáticamente, cámbialo a `true`
4. **Secrets:** Tus secrets están bien, solo asegúrate de que no tengan comillas extras

---

## 🧪 Después de Corregir

1. **Haz un Redeploy** del servicio Backend
2. **Revisa los logs** - Deberías ver:
   - `🔍 Configuración de Base de Datos`
   - `✅ DATABASE_URL encontrado`
   - `🚀 Strapi iniciado correctamente`
   - `✅ Base de datos conectada`

Si ves estos mensajes, el problema está resuelto. Si sigues viendo `AggregateError`, comparte los logs para diagnosticar más.

