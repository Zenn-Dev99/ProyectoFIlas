# 🎯 Configurar Deploy Selectivo en Railway

## 📋 Problema

Por defecto, Railway despliega **ambos servicios** (frontend y backend) cada vez que haces push, incluso si solo cambias uno de ellos.

## ✅ Solución: GitHub Actions con Detección de Cambios

He creado un workflow de GitHub Actions que detecta qué servicio cambió y solo despliega ese servicio.

---

## 🔧 Paso 1: Obtener Railway Token

1. Ve a Railway: https://railway.app
2. Haz clic en tu perfil (esquina superior derecha)
3. Selecciona **"Account Settings"**
4. Ve a la pestaña **"Tokens"**
5. Haz clic en **"New Token"**
6. Dale un nombre (ej: "GitHub Actions")
7. **Copia el token** (solo se muestra una vez)

---

## 🔑 Paso 2: Agregar Token a GitHub Secrets

1. Ve a tu repositorio en GitHub
2. Haz clic en **Settings**
3. En el menú lateral, ve a **Secrets and variables** → **Actions**
4. Haz clic en **"New repository secret"**
5. **Nombre:** `RAILWAY_TOKEN`
6. **Valor:** Pega el token que copiaste de Railway
7. Haz clic en **"Add secret"**

---

## 📝 Paso 3: Verificar Nombres de Servicios

El workflow usa los nombres de tus servicios en Railway. Verifica que coincidan:

1. Ve a Railway y revisa los nombres de tus servicios
2. Abre `.github/workflows/deploy.yml`
3. Verifica que los nombres en `service:` coincidan:
   - `service: 'backend'` → Nombre exacto de tu servicio backend
   - `service: 'frontend'` → Nombre exacto de tu servicio frontend

Si los nombres son diferentes, cámbialos en el archivo.

---

## 🚀 Paso 4: Desactivar Auto-Deploy en Railway

Para que GitHub Actions controle los deploys:

1. Ve a cada servicio en Railway (Backend y Frontend)
2. **Settings** → **Service Settings**
3. Busca **"Deploy"** o **"Auto Deploy"**
4. **Desactiva "Auto Deploy"** o configúralo para que solo se despliegue manualmente

Esto evita que Railway despliegue automáticamente cuando hay cambios.

---

## ✅ Cómo Funciona

1. **Haces push a `main`:**
   - GitHub Actions detecta qué archivos cambiaron
   - Si solo cambió `backend/**` → Solo despliega Backend
   - Si solo cambió `frontend/**` → Solo despliega Frontend
   - Si cambiaron ambos → Despliega ambos

2. **Archivos que activan Backend:**
   - Cualquier archivo en `backend/`
   - `backend/railway.json`

3. **Archivos que activan Frontend:**
   - Cualquier archivo en `frontend/`
   - `railway.json` (en la raíz)
   - `frontend/package.json`

---

## 🔍 Verificar que Funciona

1. **Haz un cambio solo en `backend/src/`:**
   ```bash
   git add backend/src/
   git commit -m "test: cambio solo en backend"
   git push
   ```
   - Revisa GitHub Actions: Solo debería ejecutarse `deploy-backend`
   - Revisa Railway: Solo el Backend debería desplegarse

2. **Haz un cambio solo en `frontend/src/`:**
   ```bash
   git add frontend/src/
   git commit -m "test: cambio solo en frontend"
   git push
   ```
   - Revisa GitHub Actions: Solo debería ejecutarse `deploy-frontend`
   - Revisa Railway: Solo el Frontend debería desplegarse

---

## ⚠️ Alternativa: Usar Railway UI (Más Simple)

Si prefieres no usar GitHub Actions, puedes configurar **Watch Paths** directamente en Railway:

### Para Backend:
1. Ve a tu servicio Backend en Railway
2. **Settings** → **Service Settings**
3. Busca **"Watch Paths"** o **"Deploy Triggers"**
4. Agrega: `backend/`

### Para Frontend:
1. Ve a tu servicio Frontend en Railway
2. **Settings** → **Service Settings**
3. Busca **"Watch Paths"** o **"Deploy Triggers"**
4. Agrega: `frontend/`

**Nota:** Esta opción puede no estar disponible en todos los planes de Railway.

---

## 🎯 Resultado Esperado

Después de configurar esto:
- ✅ Cambios en `backend/` → Solo se despliega Backend
- ✅ Cambios en `frontend/` → Solo se despliega Frontend
- ✅ Cambios en ambos → Se despliegan ambos
- ✅ Cambios solo en `docs/` → No se despliega nada

---

## 📚 Referencias

- [Railway CLI](https://docs.railway.app/develop/cli)
- [GitHub Actions](https://docs.github.com/en/actions)
