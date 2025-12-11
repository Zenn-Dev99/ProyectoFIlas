"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getTurnos, actualizarTurno, obtenerSucursalPorDefecto, obtenerCajeras, fetchAPI } from "@/lib/strapi";
import { notificarTurnoLlamado } from "@/lib/whatsapp";
import CajeraSkeleton from "@/components/skeletons/CajeraSkeleton";

interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
  email?: string;
  notas?: string;
}

interface Cajera {
  id: number;
  nombre: string;
  codigo: string;
}

interface Turno {
  id: number;
  documentId?: string; // Agregar documentId al tipo
  numero: number;
  cliente: Cliente;
  tipo: "retiro" | "compra" | "devolucion";
  ordenId?: string;
  estado: "pendiente" | "en-atencion" | "atendido" | "ausente";
  tiempoEstimado: number;
  posicionEnFila: number;
  fechaCreacion: string;
  cajera?: Cajera | null;
}

type TipoFiltro = "todos" | "compra" | "retiro" | "devolucion";

interface CajeraConfig {
  cajeraId: number;
  tiposServicio: {
    compra: boolean;
    retiro: boolean;
    devolucion: boolean;
  };
  fechaInicio: string;
}

export default function CajeraPage() {
  const router = useRouter();
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [turnoActual, setTurnoActual] = useState<Turno | null>(null);
  const [sucursalId, setSucursalId] = useState<number | null>(null);
  const [cajeras, setCajeras] = useState<Cajera[]>([]);
  const [cajeraActual, setCajeraActual] = useState<Cajera | null>(null);
  const [tiposServicioConfig, setTiposServicioConfig] = useState<{
    compra: boolean;
    retiro: boolean;
    devolucion: boolean;
  }>({
    compra: true,
    retiro: true,
    devolucion: true,
  });
  const [mostrarSoloMisTurnos, setMostrarSoloMisTurnos] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState<TipoFiltro>("todos");
  const [loading, setLoading] = useState(true);
  const [tiempoEnTurno, setTiempoEnTurno] = useState<string>("00:00");

  useEffect(() => {
    // Cargar configuración desde localStorage
    const configStr = localStorage.getItem("cajeraConfig");
    if (!configStr) {
      // Si no hay configuración, redirigir a inicio
      router.push("/cajera/inicio");
      return;
    }

    try {
      const config: CajeraConfig = JSON.parse(configStr);
      setTiposServicioConfig(config.tiposServicio);
      
      // Cargar datos y luego establecer la cajera desde la configuración
      cargarDatos(config.cajeraId);
    } catch (error) {
      console.error("Error al cargar configuración:", error);
      router.push("/cajera/inicio");
    }

    // Actualizar cada 5 segundos
    const interval = setInterval(() => {
      const configStr = localStorage.getItem("cajeraConfig");
      if (configStr) {
        const config: CajeraConfig = JSON.parse(configStr);
        cargarDatos(config.cajeraId);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [router, cargarDatos]);

  // Timer para mostrar tiempo en turno
  useEffect(() => {
    if (!turnoActual || !(turnoActual as any).fechaInicioAtencion) {
      return;
    }

    const calcularTiempo = () => {
      const inicio = new Date((turnoActual as any).fechaInicioAtencion);
      const ahora = new Date();
      const diferencia = ahora.getTime() - inicio.getTime();
      const minutos = Math.floor(diferencia / 60000);
      const segundos = Math.floor((diferencia % 60000) / 1000);
      setTiempoEnTurno(`${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`);
    };

    calcularTiempo();
    const interval = setInterval(calcularTiempo, 1000);
    return () => clearInterval(interval);
  }, [turnoActual]);

  const calcularTiempoEnTurno = (fechaInicio: string) => {
    const inicio = new Date(fechaInicio);
    const ahora = new Date();
    const diferencia = ahora.getTime() - inicio.getTime();
    const minutos = Math.floor(diferencia / 60000);
    const segundos = Math.floor((diferencia % 60000) / 1000);
    setTiempoEnTurno(`${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`);
  };

  const cargarDatos = async (cajeraIdConfig?: number) => {
    try {
      // Obtener configuración desde localStorage
      const configStr = localStorage.getItem("cajeraConfig");
      if (!configStr) {
        router.push("/cajera/inicio");
        return;
      }

      const config: CajeraConfig = JSON.parse(configStr);
      const cajeraId = cajeraIdConfig || config.cajeraId;

      // Obtener sucursal por defecto
      const sucursal = await obtenerSucursalPorDefecto();
      if (sucursal) {
        setSucursalId(sucursal.id);
        
        // Obtener cajeras de la sucursal
        const cajerasData = await obtenerCajeras(sucursal.id);
        setCajeras(cajerasData);
        
        // Establecer cajera desde la configuración (no resetear)
        if (cajeraId && !cajeraActual) {
          const cajera = cajerasData.find((c) => c.id === cajeraId);
          if (cajera) {
            setCajeraActual(cajera);
          }
        } else if (cajeraActual && cajeraActual.id !== cajeraId) {
          // Si la cajera cambió en la configuración, actualizarla
          const cajera = cajerasData.find((c) => c.id === cajeraId);
          if (cajera) {
            setCajeraActual(cajera);
          }
        }
        
        // Actualizar tipos de servicio desde configuración
        setTiposServicioConfig(config.tiposServicio);
        
        // Obtener turnos de la sucursal
        const data = await getTurnos(sucursal.id);
        const turnosData = data.data || [];
        
        // Asegurar que los IDs estén presentes y guardar documentId
        const turnosConIds = turnosData.map((t: any) => ({
          ...t,
          id: t.id || t.documentId || t._id,
          // Guardar documentId para usarlo en actualizaciones
          documentId: t.documentId || t.id,
        })).filter((t: any) => t.id);
        
        // Filtrar turnos según los tipos de servicio configurados
        const turnosFiltradosPorTipo = turnosConIds.filter((t: Turno) => {
          if (t.tipo === "compra" && !config.tiposServicio.compra) return false;
          if (t.tipo === "retiro" && !config.tiposServicio.retiro) return false;
          if (t.tipo === "devolucion" && !config.tiposServicio.devolucion) return false;
          return true;
        });
        
        // Ordenar por número
        turnosFiltradosPorTipo.sort((a: Turno, b: Turno) => a.numero - b.numero);
        setTurnos(turnosFiltradosPorTipo);
        
        // Obtener turno actual en atención de la cajera seleccionada
        if (cajeraId) {
          const enAtencion = turnosFiltradosPorTipo.find(
            (t: Turno) => t.estado === "en-atencion" && t.cajera?.id === cajeraId
          );
          if (enAtencion) {
            setTurnoActual(enAtencion);
            // Calcular tiempo transcurrido si hay fechaInicioAtencion
            if ((enAtencion as any).fechaInicioAtencion) {
              calcularTiempoEnTurno((enAtencion as any).fechaInicioAtencion);
            }
          } else {
            setTurnoActual(null);
            setTiempoEnTurno("00:00");
          }
        }
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const llamarTurno = async (turno: Turno) => {
    if (!cajeraActual) {
      alert("Por favor, selecciona una cajera primero");
      return;
    }

    try {
      // Usar documentId si está disponible (más confiable), de lo contrario usar id
      const turnoId = (turno as any).documentId || turno.id;
      
      if (!turnoId) {
        console.error("El turno no tiene ID válido:", turno);
        alert("Error: El turno no tiene un ID válido. Por favor, recarga la página.");
        return;
      }
      
      // Preparar datos para actualizar
      const datosActualizacion: any = {
        estado: "en-atencion",
        fechaInicioAtencion: new Date().toISOString(),
      };
      
      // Solo agregar cajera si el ID es válido
      if (cajeraActual.id) {
        datosActualizacion.cajera = cajeraActual.id;
      }
      
      // Actualizar estado en Strapi y asignar cajera (usando documentId si está disponible)
      await actualizarTurno(turnoId, datosActualizacion);

      // Enviar notificación WhatsApp (no bloquear si falla)
      try {
        await notificarTurnoLlamado(turno.cliente.telefono, turno.numero);
      } catch (whatsappError) {
        console.warn("Error al enviar notificación WhatsApp:", whatsappError);
        // Continuar aunque falle la notificación
      }

      // Redirigir a la pantalla de detalle (usar el mismo ID que usamos para actualizar)
      router.push(`/cajera/detalle/${turnoId}`);
    } catch (error) {
      console.error("Error completo al llamar turno:", error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      if (errorMessage.includes('404')) {
        alert(`Error 404: No se encontró el turno con ID ${turno.id}.\n\nPosibles causas:\n1. El turno fue eliminado\n2. El ID del turno no es correcto\n3. Los permisos no están habilitados\n\nRevisa la consola (F12) para más detalles.`);
      } else {
        alert(`Error al llamar turno: ${errorMessage}\n\nRevisa la consola (F12) para más detalles.`);
      }
    }
  };

  const marcarAtendido = async (turnoId: number | string) => {
    try {
      // Actualizar estado en Strapi
      await actualizarTurno(turnoId, {
        estado: "atendido",
        fechaFinAtencion: new Date().toISOString(),
      });

      // Limpiar turno actual si es el que se marcó
      if (turnoActual?.id === turnoId) {
        setTurnoActual(null);
      }

      // Recargar datos
      await cargarDatos();
    } catch (error) {
      console.error("Error al marcar como atendido:", error);
      alert("Error al marcar como atendido. Por favor, intenta nuevamente.");
    }
  };

  // Filtrar turnos según los filtros aplicados
  // Los turnos ya vienen filtrados por tipo de servicio desde cargarDatos
  let turnosFiltrados = turnos.filter((t) => t.estado === "pendiente");

  // Filtrar por tipo de servicio adicional (si el usuario quiere ver solo uno)
  if (filtroTipo !== "todos") {
    turnosFiltrados = turnosFiltrados.filter((t) => t.tipo === filtroTipo);
  }

  // Filtrar por cajera si está activo
  if (mostrarSoloMisTurnos && cajeraActual) {
    turnosFiltrados = turnosFiltrados.filter(
      (t) => !t.cajera || t.cajera.id === cajeraActual.id
    );
  }

  const tipoLabels = {
    compra: "Pedidos/Compras",
    retiro: "Retiros",
    devolucion: "Devoluciones",
  };

  const tipoColors = {
    compra: "bg-green-100 text-green-800 border-green-300",
    retiro: "bg-blue-100 text-blue-800 border-blue-300",
    devolucion: "bg-orange-100 text-orange-800 border-orange-300",
  };

  if (loading) {
    return <CajeraSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header con Información de Cajera */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Panel de Cajera</h1>
              {cajeraActual && (
                <div className="space-y-1">
                  <p className="text-gray-600">
                    Cajera: <span className="font-semibold text-blue-600">{cajeraActual.nombre}</span>
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {tiposServicioConfig.compra && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">🛒 Compras</span>
                    )}
                    {tiposServicioConfig.retiro && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">📦 Retiros</span>
                    )}
                    {tiposServicioConfig.devolucion && (
                      <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">🔄 Devoluciones</span>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-4 items-center">
              <button
                onClick={() => {
                  if (confirm("¿Estás seguro de que deseas finalizar tu turno? Deberás iniciar un nuevo turno para continuar.")) {
                    localStorage.removeItem("cajeraConfig");
                    router.push("/cajera/inicio");
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                🛑 Finalizar Turno
              </button>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={mostrarSoloMisTurnos}
                  onChange={(e) => setMostrarSoloMisTurnos(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Solo mis turnos</span>
              </label>
            </div>
          </div>

            {/* Filtros por Tipo de Servicio */}
            <div className="border-t pt-4">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Filtrar por tipo de servicio:
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFiltroTipo("todos")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filtroTipo === "todos"
                      ? "bg-gray-800 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Todos
                </button>
                {tiposServicioConfig.compra && (
                  <button
                    onClick={() => setFiltroTipo("compra")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filtroTipo === "compra"
                        ? "bg-green-600 text-white"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    🛒 {tipoLabels.compra}
                  </button>
                )}
                {tiposServicioConfig.retiro && (
                  <button
                    onClick={() => setFiltroTipo("retiro")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filtroTipo === "retiro"
                        ? "bg-blue-600 text-white"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    }`}
                  >
                    📦 {tipoLabels.retiro}
                  </button>
                )}
                {tiposServicioConfig.devolucion && (
                  <button
                    onClick={() => setFiltroTipo("devolucion")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filtroTipo === "devolucion"
                        ? "bg-orange-600 text-white"
                        : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                    }`}
                  >
                    🔄 {tipoLabels.devolucion}
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Solo se muestran los tipos de servicio que seleccionaste al iniciar tu turno
              </p>
            </div>
          </div>

        {/* Turno Actual */}
        {turnoActual && turnoActual.cajera?.id === cajeraActual?.id && (
          <div className="bg-blue-100 border-2 border-blue-500 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-semibold">Turno en Atención</h2>
                <div className="mt-2 flex items-center gap-4">
                  <span className="text-sm text-gray-600">Tiempo transcurrido:</span>
                  <span className="text-2xl font-bold text-blue-700 font-mono">{tiempoEnTurno}</span>
                </div>
              </div>
              <button
                onClick={() => router.push(`/cajera/detalle/${turnoActual.id}`)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Ver Detalles Completos →
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-blue-600">#{turnoActual.numero}</span>
                </div>
                <div className="space-y-2">
                  <p className="text-lg">
                    <strong>Cliente:</strong> {turnoActual.cliente.nombre}
                  </p>
                  <p className="text-lg">
                    <strong>Teléfono:</strong> {turnoActual.cliente.telefono}
                  </p>
                </div>
              </div>
              <div>
                <div className="space-y-2 mb-4">
                  <p className="text-lg">
                    <strong>Tipo:</strong>{" "}
                    <span className={`capitalize px-3 py-1 rounded ${tipoColors[turnoActual.tipo]}`}>
                      {tipoLabels[turnoActual.tipo] || turnoActual.tipo}
                    </span>
                  </p>
                  {turnoActual.ordenId && (
                    <p className="text-lg">
                      <strong>Número de Orden:</strong>{" "}
                      <span className="font-mono bg-white px-2 py-1 rounded">
                        {turnoActual.ordenId}
                      </span>
                    </p>
                  )}
                </div>
                <button
                  onClick={() => marcarAtendido(turnoActual.id)}
                  className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold text-lg"
                >
                  ✅ Marcar como Atendido
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Turnos Pendientes */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Turnos Pendientes</h2>
            <div className="text-sm text-gray-600">
              {filtroTipo !== "todos" && (
                <span className="mr-2">
                  {tipoLabels[filtroTipo]}:{" "}
                </span>
              )}
              Total: <span className="font-bold text-blue-600">{turnosFiltrados.length}</span>
            </div>
          </div>
          {turnosFiltrados.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No hay turnos pendientes
              {filtroTipo !== "todos" && ` para ${tipoLabels[filtroTipo]}`}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {turnosFiltrados.map((turno) => {
                const asignadoAOtraCajera = turno.cajera && turno.cajera.id !== cajeraActual?.id;
                return (
                  <div
                    key={turno.id}
                    className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                      asignadoAOtraCajera
                        ? "border-yellow-300 bg-yellow-50"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-4xl font-bold text-blue-600">
                        #{turno.numero}
                      </span>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded ${tipoColors[turno.tipo]}`}>
                          {tipoLabels[turno.tipo] || turno.tipo}
                        </span>
                        <span className="text-xs text-gray-500 block mt-1">
                          {new Date(turno.fechaCreacion).toLocaleTimeString()}
                        </span>
                        {turno.cajera && (
                          <span className="text-xs text-gray-600 block mt-1">
                            {turno.cajera.nombre}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-1 mb-3">
                      <p className="font-semibold text-lg">{turno.cliente.nombre}</p>
                      <p className="text-sm text-gray-600">{turno.cliente.telefono}</p>
                      {turno.cliente.email && (
                        <p className="text-xs text-gray-500">{turno.cliente.email}</p>
                      )}
                    </div>

                    <div className="border-t pt-2 mb-3">
                      {turno.ordenId && (
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Orden:</strong>{" "}
                          <span className="font-mono">{turno.ordenId}</span>
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        Posición: {turno.posicionEnFila} | Est. {turno.tiempoEstimado} min
                      </p>
                    </div>

                    {asignadoAOtraCajera ? (
                      <div className="w-full bg-yellow-200 text-yellow-800 px-4 py-2 rounded-lg text-sm text-center">
                        Asignado a {turno.cajera.nombre}
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          console.log("Llamando turno:", turno);
                          llamarTurno(turno);
                        }}
                        disabled={!cajeraActual}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        📢 Llamar Turno
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
