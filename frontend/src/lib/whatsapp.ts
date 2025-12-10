/**
 * Utilidades para enviar mensajes por WhatsApp usando Twilio
 * 
 * Requiere configuración en variables de entorno:
 * TWILIO_ACCOUNT_SID
 * TWILIO_AUTH_TOKEN
 * TWILIO_WHATSAPP_NUMBER (formato: whatsapp:+521234567890)
 */

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER;

export async function enviarMensajeWhatsApp(
  telefono: string,
  mensaje: string
): Promise<boolean> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_NUMBER) {
    console.error('Twilio credentials not configured');
    return false;
  }

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(
            `${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`
          ).toString('base64')}`,
        },
        body: new URLSearchParams({
          From: TWILIO_WHATSAPP_NUMBER,
          To: `whatsapp:${telefono}`,
          Body: mensaje,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Twilio API error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return false;
  }
}

export async function notificarTurnoGenerado(
  telefono: string,
  numeroTurno: number,
  tiempoEstimado: number
): Promise<void> {
  const mensaje = `✅ Tu turno ha sido generado exitosamente!

📋 Número de turno: #${numeroTurno}
⏱️ Tiempo estimado: ${tiempoEstimado} minutos

Te notificaremos cuando falten 10 números para tu atención.

Gracias por tu paciencia. 😊`;
  
  await enviarMensajeWhatsApp(telefono, mensaje);
}

export async function notificarProximidad(
  telefono: string,
  numeroTurno: number,
  turnosRestantes: number
): Promise<void> {
  const mensaje = `🔔 ¡Atención!

Tu turno #${numeroTurno} está próximo.

Faltan ${turnosRestantes} números antes de tu atención.

Por favor, acércate a la sucursal. 🏃‍♂️`;
  
  await enviarMensajeWhatsApp(telefono, mensaje);
}

export async function notificarTurnoLlamado(
  telefono: string,
  numeroTurno: number
): Promise<void> {
  const mensaje = `📢 ¡Es tu turno!

Turno #${numeroTurno} está siendo atendido.

Por favor, acércate al mostrador inmediatamente. 🏃‍♂️`;
  
  await enviarMensajeWhatsApp(telefono, mensaje);
}

