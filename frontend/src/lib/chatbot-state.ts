/**
 * Sistema de gestión de estado del chatbot
 * En producción, esto debería estar en una base de datos o Redis
 */

interface ChatbotState {
  telefono: string;
  estado: 'inicio' | 'esperando_tipo' | 'esperando_orden' | 'esperando_nombre' | 'esperando_email' | 'completado';
  tipo?: 'retiro' | 'compra' | 'devolucion';
  ordenId?: string;
  nombre?: string;
  email?: string;
  clienteId?: number;
  turnoId?: number;
  sucursalId?: number;
  timestamp: number;
}

// Almacenamiento en memoria (en producción usar Redis o DB)
const estadosChatbot = new Map<string, ChatbotState>();

const TIMEOUT_ESTADO = 30 * 60 * 1000; // 30 minutos

export function obtenerEstado(telefono: string): ChatbotState | null {
  const estado = estadosChatbot.get(telefono);
  
  // Limpiar estados expirados
  if (estado && Date.now() - estado.timestamp > TIMEOUT_ESTADO) {
    estadosChatbot.delete(telefono);
    return null;
  }
  
  return estado || null;
}

export function guardarEstado(telefono: string, estado: Partial<ChatbotState>): ChatbotState {
  const estadoActual = obtenerEstado(telefono);
  const nuevoEstado: ChatbotState = {
    telefono,
    estado: estado.estado || estadoActual?.estado || 'inicio',
    tipo: estado.tipo || estadoActual?.tipo,
    ordenId: estado.ordenId || estadoActual?.ordenId,
    nombre: estado.nombre || estadoActual?.nombre,
    email: estado.email || estadoActual?.email,
    clienteId: estado.clienteId || estadoActual?.clienteId,
    turnoId: estado.turnoId || estadoActual?.turnoId,
    sucursalId: estado.sucursalId || estadoActual?.sucursalId || 1, // Por defecto sucursal 1
    timestamp: Date.now(),
  };
  
  estadosChatbot.set(telefono, nuevoEstado);
  return nuevoEstado;
}

export function limpiarEstado(telefono: string): void {
  estadosChatbot.delete(telefono);
}

export function esEmailValido(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

