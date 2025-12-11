# 📋 Ver Logs en Railway (Plan Gratuito)

## ⚠️ Límites del Plan Gratuito

El plan gratuito de Railway tiene algunas limitaciones:
- **Logs retenidos:** Solo los últimos logs están disponibles
- **Tiempo de retención:** Los logs antiguos se eliminan
- **Límite de visualización:** Puede haber límites en la cantidad de logs visibles

## ✅ Alternativas para Ver Logs

### Opción 1: Ver Logs en Tiempo Real

1. Ve a tu servicio Backend en Railway
2. Haz clic en **"Deploy Logs"** o **"HTTP Logs"**
3. Los logs se actualizan en tiempo real
4. **Tip:** Mantén la pestaña abierta mientras se hace el deploy

### Opción 2: Usar Railway CLI

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Conectar al proyecto
railway link

# Ver logs en tiempo real
railway logs --service backend
```

### Opción 3: Agregar Logs a un Archivo

Los logs ahora se guardan en `/tmp/strapi.log` dentro del contenedor.

Para verlos:
```bash
railway run --service backend cat /tmp/strapi.log
```

### Opción 4: Usar Variables de Entorno para Debug

Puedes agregar una variable de entorno `DEBUG=true` y el script de inicio mostrará más información.

## 🔍 Qué Buscar en los Logs

### Logs Esperados (en orden):

1. **Al iniciar el contenedor:**
   ```
   🚀 Iniciando Strapi...
   📍 Variables de entorno:
      NODE_ENV: production
      HOST: 0.0.0.0
      PORT: [número]
      DATABASE_CLIENT: postgres
      DATABASE_URL: set (hidden)
   ```

2. **Si DATABASE_URL no está configurado:**
   ```
   ❌ ERROR: DATABASE_URL no está configurado pero DATABASE_CLIENT=postgres
   ```

3. **Durante el inicio de Strapi:**
   ```
   📝 Register function ejecutada
   🔍 Configuración de Base de Datos:
      Client: postgres
      ✅ DATABASE_URL encontrado
   ```

4. **Si todo está bien:**
   ```
   🔧 Iniciando bootstrap de Strapi...
   🚀 Strapi iniciado correctamente
   ✅ Base de datos conectada
   ```

## 🚨 Errores Comunes

### Error: "DATABASE_URL no está configurado"
**Solución:** Configura `DATABASE_URL` en Railway → Backend → Variables

### Error: "AggregateError"
**Solución:** Problema de conexión a PostgreSQL. Verifica que:
- PostgreSQL esté "Online"
- `DATABASE_URL` sea correcto
- `DATABASE_CLIENT=postgres` esté configurado

### Error: "Cannot find module"
**Solución:** Problema con las dependencias. Verifica que el build se complete correctamente.

## 💡 Tips

1. **Haz el deploy y mantén los logs abiertos** - Los primeros logs son los más importantes
2. **Usa Railway CLI** - Puedes ver más logs que en la interfaz web
3. **Revisa los Build Logs** - A veces el problema está en el build, no en el runtime
4. **Verifica las variables de entorno** - Muchos errores son por variables mal configuradas

## 🔧 Si No Puedes Ver los Logs

Si realmente no puedes ver los logs en Railway:

1. **Agrega más console.log** en el código (ya lo hicimos)
2. **Usa Railway CLI** para ver logs completos
3. **Revisa el estado del servicio** - Si está en "Failed", hay un error
4. **Verifica las variables de entorno** - Es el problema más común

