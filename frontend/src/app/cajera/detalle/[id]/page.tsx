"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTurnoById, actualizarTurno, obtenerOrdenPorNumero } from "@/lib/strapi";
import DetalleTurnoSkeleton from "@/components/skeletons/DetalleTurnoSkeleton";

interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
  email?: string;
  notas?: string;
}

interface Orden {
  id: number;
  numeroOrden: string;
  productos: any;
  total: number;
  estado: string;
  notas?: string;
}

interface Turno {
  id: number;
  numero: number;
  cliente: Cliente;
  tipo: "retiro" | "compra" | "devolucion";
  ordenId?: string;
  estado: string;
  fechaCreacion: string;
  orden?: Orden | null;
}

export default function DetalleTurnoPage() {
  const params = useParams();
  const router = useRouter();
  const turnoId = params.id as string;
  const [turno, setTurno] = useState<Turno | null>(null);
  const [loading, setLoading] = useState(true);
  const [marcandoAtendido, setMarcandoAtendido] = useState(false);

  const cargarTurno = useCallback(async () => {
    try {
      // Usar getTurnoById que ya maneja el fallback a la lista
      const turnoData = await getTurnoById(turnoId);
      
      if (!turnoData) {
        throw new Error("Turno no encontrado");
      }

      // Si tiene ordenId, buscar la orden
      if (turnoData.ordenId) {
        try {
          const orden = await obtenerOrdenPorNumero(turnoData.ordenId);
          if (orden) {
            turnoData.orden = orden;
          }
        } catch (error) {
          console.error("Error al cargar orden:", error);
        }
      }

      setTurno(turnoData);
    } catch (error) {
      console.error("Error al cargar turno:", error);
      alert("Error al cargar el turno. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }, [turnoId]);

  useEffect(() => {
    cargarTurno();
  }, [turnoId, cargarTurno]);

  const marcarAtendido = async () => {
    if (!turno) return;

    setMarcandoAtendido(true);
    try {
      // Usar actualizarTurno que maneja el documentId correctamente
      await actualizarTurno(turno.id, {
        estado: "atendido",
        fechaFinAtencion: new Date().toISOString(),
      });

      // Redirigir al panel de cajera
      router.push("/cajera");
    } catch (error) {
      console.error("Error al marcar como atendido:", error);
      alert("Error al marcar como atendido");
    } finally {
      setMarcandoAtendido(false);
    }
  };

  if (loading) {
    return <DetalleTurnoSkeleton />;
  }

  if (!turno) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Turno no encontrado</h1>
          <button
            onClick={() => router.push("/cajera")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Volver al Panel
          </button>
        </div>
      </div>
    );
  }

  const tipoLabels = {
    retiro: "Retiro de Pedido",
    compra: "Compra en Tienda",
    devolucion: "Devolución",
  };

  const tipoColors = {
    retiro: "bg-blue-100 text-blue-800 border-blue-300",
    compra: "bg-green-100 text-green-800 border-green-300",
    devolucion: "bg-orange-100 text-orange-800 border-orange-300",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/cajera")}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
          >
            ← Volver al Panel
          </button>
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold text-gray-800">
              Detalle del Turno #{turno.numero}
            </h1>
            <span
              className={`px-4 py-2 rounded-lg font-semibold border-2 ${tipoColors[turno.tipo]}`}
            >
              {tipoLabels[turno.tipo]}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Información del Cliente */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              👤 Información del Cliente
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Nombre Completo</label>
                <p className="text-lg font-semibold text-gray-800">{turno.cliente.nombre}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Teléfono</label>
                <p className="text-lg text-gray-800">{turno.cliente.telefono}</p>
              </div>
              {turno.cliente.email && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-lg text-gray-800">{turno.cliente.email}</p>
                </div>
              )}
              {turno.cliente.notas && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Notas</label>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {turno.cliente.notas}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Información del Turno */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              🎫 Información del Turno
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Número de Turno</label>
                <p className="text-3xl font-bold text-blue-600">#{turno.numero}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Estado</label>
                <p className="text-lg capitalize text-gray-800">{turno.estado}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Fecha de Creación</label>
                <p className="text-lg text-gray-800">
                  {new Date(turno.fechaCreacion).toLocaleString("es-ES")}
                </p>
              </div>
              {turno.ordenId && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Número de Orden</label>
                  <p className="text-lg font-mono font-semibold text-gray-800">
                    {turno.ordenId}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Información de la Orden (si es retiro) */}
        {turno.tipo === "retiro" && turno.orden && (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              📦 Información del Pedido
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600">Número de Orden</label>
                <p className="text-xl font-mono font-semibold text-gray-800">
                  {turno.orden.numeroOrden}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Estado</label>
                <p className="text-lg capitalize text-gray-800">{turno.orden.estado}</p>
              </div>
              {turno.orden.total && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Total</label>
                  <p className="text-xl font-semibold text-gray-800">
                    ${turno.orden.total.toLocaleString("es-ES")}
                  </p>
                </div>
              )}
            </div>

            {/* Productos */}
            {turno.orden.productos && (
              <div className="mt-6">
                <label className="text-sm font-medium text-gray-600 block mb-3">
                  Productos
                </label>
                <div className="bg-gray-50 rounded-lg p-4">
                  {Array.isArray(turno.orden.productos) ? (
                    <ul className="space-y-2">
                      {turno.orden.productos.map((producto: any, index: number) => (
                        <li
                          key={index}
                          className="flex justify-between items-center p-2 bg-white rounded"
                        >
                          <span className="text-gray-800">
                            {producto.nombre || producto.name || `Producto ${index + 1}`}
                          </span>
                          {producto.cantidad && (
                            <span className="text-gray-600">x{producto.cantidad}</span>
                          )}
                          {producto.precio && (
                            <span className="font-semibold text-gray-800">
                              ${producto.precio.toLocaleString("es-ES")}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                      {JSON.stringify(turno.orden.productos, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            )}

            {turno.orden.notas && (
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-600">Notas de la Orden</label>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg mt-2">
                  {turno.orden.notas}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Información de Devolución (si es devolución) */}
        {turno.tipo === "devolucion" && (
          <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6 mt-6">
            <h2 className="text-2xl font-semibold mb-4 text-orange-800">
              🔄 Información de Devolución
            </h2>
            <p className="text-gray-700">
              Este turno es para procesar una devolución. Por favor, verifica los productos y
              procesa la devolución según las políticas de la tienda.
            </p>
            {turno.ordenId && (
              <div className="mt-4">
                <label className="text-sm font-medium text-orange-800">
                  Orden Original: {turno.ordenId}
                </label>
              </div>
            )}
          </div>
        )}

        {/* Botón de Acción */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={marcarAtendido}
            disabled={marcandoAtendido}
            className="flex-1 bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 font-semibold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {marcandoAtendido ? "Procesando..." : "✅ Marcar como Atendido"}
          </button>
          <button
            onClick={() => router.push("/cajera")}
            className="px-8 py-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

