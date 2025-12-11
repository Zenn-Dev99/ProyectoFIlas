# 🚀 Crear API Token Rápido (Sin Interfaz)

## ⚡ Solución Rápida

El error en la interfaz de Strapi no afecta la API. Usa este script para crear el token directamente:

### Paso 1: Ejecutar el Script

```powershell
# Configurar variables (reemplaza con tus credenciales reales)
$env:STRAPI_URL="https://proyectofilas-production.up.railway.app"
$env:ADMIN_EMAIL="tu_email_de_admin@ejemplo.com"
$env:ADMIN_PASSWORD="tu_password_de_admin"

# Ejecutar script
node scripts/crear-api-token.js
```

### Paso 2: Copiar el Token

El script te mostrará algo como:

```
🔐 TOKEN (cópialo ahora, solo se muestra una vez):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**⚠️ IMPORTANTE:** Copia el token completo. Solo se muestra una vez.

### Paso 3: Guardar el Token

El script también guarda el token en `api-token.json`. Puedes leerlo después:

```powershell
# Ver el token guardado
Get-Content api-token.json | ConvertFrom-Json | Select-Object -ExpandProperty accessKey
```

---

## 🎯 Usar el Token para el Seed

Una vez que tengas el token:

```powershell
$env:STRAPI_URL="https://proyectofilas-production.up.railway.app"
$env:STRAPI_API_TOKEN="el_token_que_copiaste"
node scripts/seed-datos-prueba.js
```

---

## ❓ ¿No tienes las credenciales de admin?

Si no recuerdas las credenciales de admin:

1. **Opción A:** Crea un nuevo admin usando Railway CLI:
   ```bash
   railway run --service backend npm run strapi admin:create-user
   ```

2. **Opción B:** Si es la primera vez, el admin se crea al iniciar Strapi por primera vez. Revisa los logs de Railway para ver si hay un mensaje con las credenciales.

---

## ✅ Listo

Con el token creado, puedes ejecutar el seed cuando quieras sin necesidad de usar la interfaz de Strapi.

