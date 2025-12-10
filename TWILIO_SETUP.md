# Configuración de Twilio para WhatsApp

## 📋 Requisitos Previos

1. Cuenta en Twilio (https://www.twilio.com)
2. Número de WhatsApp verificado en Twilio
3. Credenciales de API (Account SID y Auth Token)

## 🔧 Pasos de Configuración

### 1. Obtener Credenciales de Twilio

1. Ve a https://www.twilio.com/console
2. Copia tu **Account SID** y **Auth Token**
3. Ve a **Phone Numbers > Manage > Active numbers**
4. Selecciona tu número de WhatsApp y copia el número completo (formato: `whatsapp:+521234567890`)

### 2. Configurar Variables de Entorno

Crea o edita `.env.local` en `frontend/`:

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
TWILIO_ACCOUNT_SID=tu_account_sid_aqui
TWILIO_AUTH_TOKEN=tu_auth_token_aqui
TWILIO_WHATSAPP_NUMBER=whatsapp:+521234567890
```

### 3. Configurar Webhook en Twilio

1. Ve a **Messaging > Settings > WhatsApp Sandbox** (o tu número verificado)
2. En **A MESSAGE COMES IN**, configura:
   - **HTTP POST**: `https://tu-dominio.com/api/whatsapp/inbound`
   - O para desarrollo local con ngrok: `https://tu-ngrok-url.ngrok.io/api/whatsapp/inbound`

### 4. Para Desarrollo Local (ngrok)

1. Instala ngrok: https://ngrok.com/download
2. Ejecuta: `ngrok http 3000`
3. Copia la URL HTTPS generada
4. Configura esa URL en Twilio (paso 3)

## 🧪 Probar la Integración

1. Envía un mensaje de WhatsApp a tu número de Twilio
2. Deberías recibir una respuesta automática del chatbot
3. Revisa los logs en la consola de Next.js para ver los mensajes recibidos

## 📱 Flujo del Chatbot

El chatbot maneja los siguientes estados:

1. **Inicio**: Responde a "hola" o "inicio"
2. **Selección de servicio**: 
   - Opción 1: Retirar pedido
   - Opción 2: Realizar compra
3. **Recolección de datos**:
   - Número de orden (si es retiro)
   - Nombre del cliente
   - Información adicional
4. **Confirmación**: Genera turno y envía notificación

## 🔔 Notificaciones Automáticas

El sistema envía automáticamente:

- ✅ **Al crear turno**: Número asignado y tiempo estimado
- 🔔 **Faltan 10 números**: Notificación de proximidad
- 📢 **Turno llamado**: Notificación para acercarse

## 🛠️ Personalización

Puedes personalizar los mensajes editando:
- `frontend/src/lib/whatsapp.ts` - Funciones de notificación
- `frontend/src/app/api/whatsapp/inbound/route.ts` - Lógica del chatbot

## 📚 Recursos

- [Twilio WhatsApp API Docs](https://www.twilio.com/docs/whatsapp)
- [Twilio TwiML](https://www.twilio.com/docs/messaging/twiml)
- [ngrok Documentation](https://ngrok.com/docs)

