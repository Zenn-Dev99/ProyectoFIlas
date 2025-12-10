# Configuración Completa de Twilio para WhatsApp Bot

## 📋 Requisitos Previos

1. Cuenta en Twilio (https://www.twilio.com) - Puedes crear una cuenta gratuita
2. Número de WhatsApp Business (o usar el Sandbox de Twilio para pruebas)
3. Servidor con URL pública (o usar ngrok para desarrollo local)

## 🔧 Paso 1: Configurar Twilio

### 1.1 Obtener Credenciales

1. Ve a https://www.twilio.com/console
2. En el dashboard, copia:
   - **Account SID** (empieza con `AC...`)
   - **Auth Token** (haz clic en "View" para verlo)

### 1.2 Configurar WhatsApp

**Opción A: WhatsApp Sandbox (Para Pruebas)**

1. Ve a **Messaging > Try it out > Send a WhatsApp message**
2. Únete al Sandbox siguiendo las instrucciones
3. Copia el número de WhatsApp del Sandbox (formato: `whatsapp:+14155238886`)

**Opción B: WhatsApp Business API (Producción)**

1. Ve a **Messaging > Settings > WhatsApp Senders**
2. Solicita un número de WhatsApp Business
3. Espera la aprobación de Twilio
4. Una vez aprobado, copia tu número

## 🔧 Paso 2: Configurar Variables de Entorno

Crea o edita el archivo `.env.local` en `frontend/`:

```env
# Strapi
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337

# WhatsApp Bot (para el QR)
NEXT_PUBLIC_WHATSAPP_NUMBER=+56930690742

# Twilio Credentials
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+56930690742
```

**Reemplaza:**
- `ACxxxxxxxx...` con tu Account SID
- `xxxxxxxx...` con tu Auth Token  
- `+56930690742` con tu número de WhatsApp de Twilio

## 🔧 Paso 3: Configurar Webhook en Twilio

### 3.1 Para Desarrollo Local (usando ngrok)

1. **Instala ngrok:**
   ```bash
   # Descarga desde https://ngrok.com/download
   # O con npm:
   npm install -g ngrok
   ```

2. **Inicia tu servidor Next.js:**
   ```bash
   npm run dev:frontend
   ```

3. **En otra terminal, inicia ngrok:**
   ```bash
   ngrok http 3000
   ```

4. **Copia la URL HTTPS** que ngrok genera (ejemplo: `https://abc123.ngrok.io`)

5. **Configura en Twilio:**
   - Ve a **Messaging > Settings > WhatsApp Sandbox** (o tu número de WhatsApp)
   - En **A MESSAGE COMES IN**, configura:
     - **HTTP POST**: `https://tu-url-ngrok.ngrok.io/api/whatsapp/inbound`
     - Guarda los cambios

### 3.2 Para Producción

1. Despliega tu aplicación Next.js (Vercel, Netlify, etc.)
2. Obtén la URL pública de tu aplicación
3. En Twilio, configura el webhook:
   - **HTTP POST**: `https://tu-dominio.com/api/whatsapp/inbound`

## 🔧 Paso 4: Verificar Configuración

### 4.1 Probar el Webhook

1. Envía un mensaje de WhatsApp al número de Twilio
2. Deberías recibir una respuesta automática del bot
3. Revisa los logs en la consola de Next.js para ver los mensajes recibidos

### 4.2 Flujo del Chatbot

El bot debería seguir este flujo:

1. **Inicio**: Cliente escanea QR o envía "hola"
2. **Tipo de servicio**: 
   - Opción 1: Retirar pedido
   - Opción 2: Realizar compra
3. **Si es retiro**: Pide número de orden
4. **Nombre**: Pide nombre completo
5. **Email**: Pide correo (opcional, puede omitir)
6. **Confirmación**: Crea turno en Strapi y muestra número de turno

## 🔧 Paso 5: Configurar Strapi

### 5.1 Crear Sucursal

1. Inicia Strapi: `npm run dev:backend`
2. Ve a http://localhost:1337/admin
3. Ve a **Content Manager > Sucursal**
4. Crea una nueva sucursal:
   - **Nombre**: "Sucursal Principal"
   - **Código**: "SUC-001"
   - **Tiempo promedio de atención**: 5 (minutos)
   - **Activa**: ✓
   - Guarda

### 5.2 Configurar Permisos

1. Ve a **Settings > Users & Permissions Plugin > Roles > Public**
2. Habilita `find` y `findOne` para:
   - ✅ Turno
   - ✅ Cliente
   - ✅ Sucursal
   - ✅ Publicidad
3. Guarda los cambios

## 🧪 Probar el Sistema Completo

### 1. Escanear QR en la Pantalla TV
- Ve a `http://localhost:3000/tv`
- Escanea el código QR con WhatsApp
- Debería abrir WhatsApp con el número del bot

### 2. Interactuar con el Bot
- Sigue el flujo del chatbot
- Responde las preguntas
- Verifica que se cree el turno en Strapi

### 3. Ver Turno en Panel de Cajera
- Ve a `http://localhost:3000/cajera`
- Deberías ver el turno creado con toda la información:
  - Nombre del cliente
  - Teléfono
  - Email (si se proporcionó)
  - Número de orden (si es retiro)
  - Tipo de servicio

### 4. Llamar Turno
- Haz clic en "Llamar Turno"
- El cliente debería recibir notificación por WhatsApp
- El turno aparece en "Turno en Atención"

### 5. Marcar como Atendido
- Haz clic en "Marcar como Atendido"
- El turno se marca como completado

## 📱 Notificaciones Automáticas

El sistema envía automáticamente:

- ✅ **Al crear turno**: Número asignado y tiempo estimado
- 🔔 **Faltan 10 números**: Notificación de proximidad (pendiente implementar)
- 📢 **Turno llamado**: Notificación para acercarse al mostrador

## 🐛 Solución de Problemas

### El QR no funciona
- Verifica que `NEXT_PUBLIC_WHATSAPP_NUMBER` tenga el formato correcto: `+56930690742`
- Asegúrate de que el número tenga WhatsApp Business activo

### El bot no responde
- Verifica que el webhook esté configurado correctamente en Twilio
- Revisa los logs de Next.js para ver errores
- Asegúrate de que ngrok esté corriendo (si estás en desarrollo local)

### Los turnos no se crean
- Verifica que Strapi esté corriendo
- Revisa los permisos en Strapi (deben estar habilitados para Public)
- Verifica que exista al menos una sucursal activa

### Error 401 en Strapi
- Los permisos públicos deben estar habilitados
- Verifica que la URL de Strapi sea correcta en `.env.local`

## 📚 Recursos Adicionales

- [Twilio WhatsApp API Docs](https://www.twilio.com/docs/whatsapp)
- [Twilio TwiML](https://www.twilio.com/docs/messaging/twiml)
- [ngrok Documentation](https://ngrok.com/docs)
- [Strapi Documentation](https://docs.strapi.io)

## ✅ Checklist de Configuración

- [ ] Cuenta de Twilio creada
- [ ] WhatsApp Sandbox o Business configurado
- [ ] Credenciales de Twilio obtenidas
- [ ] Variables de entorno configuradas en `.env.local`
- [ ] Webhook configurado en Twilio
- [ ] ngrok corriendo (desarrollo local) o dominio público (producción)
- [ ] Strapi corriendo y configurado
- [ ] Sucursal creada en Strapi
- [ ] Permisos públicos habilitados en Strapi
- [ ] Bot probado y funcionando
- [ ] Panel de cajera mostrando turnos correctamente

