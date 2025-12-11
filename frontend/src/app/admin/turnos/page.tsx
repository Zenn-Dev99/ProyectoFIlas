"use client";

import { useState, useEffect, useCallback } from "react";
import { obtenerTodosLosTurnos, actualizarTurno } from "@/lib/strapi";
import { useSucursal } from "@/contexts/SucursalContext";
import { useRouter } from "next/navigation";

interface Turno {
  id: number;
  numero: number;
  cliente: {
    id: number;
    nombre: string;
    telefono: string;
    email?: string;
  };
  tipo: "retiro" | "compra" | "devolucion";
  ordenId?: string;
  estado: "pendiente" | "en-atencion" | "atendido" | "ausente";
  fechaCreacion: string;
  fechaInicioAtencion?: string;
  fechaFinAtencion?: string;
  cajera?: {
    id: number;
    nombre: string;
    codigo: string;
  } | null;
}

export default function AdminTurnosPage() {
  const router = useRouter();
  const { sucursalSeleccionada, loading: sucursalLoading } = useSucursal();
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");

  const cargarTurnos = useCallback(async () => {
    if (!sucursalSeleccionada) {
      setLoading(false);
      return;
    }

    try {
      const data = await obtenerTodosLosTurnos(sucursalSeleccionada.id);
      const turnosData = data.data || [];
      setTurnos(turnosData);
    } catch (error) {
      console.error("Error al cargar turnos:", error);
    } finally {
      setLoading(false);
    }
  }, [sucursalSeleccionada]);

  useEffect(() => {
    if (!sucursalLoading && sucursalSeleccionada) {
      cargarTurnos();
      const interval = setInterval(cargarTurnos, 5000);
      return () => clearInterval(interval);
    }
  }, [sucursalSeleccionada, sucursalLoading, cargarTurnos]);

  const finalizarTurno = async (turnoId: number) => {
    if (!confirm("¿Estás seguro de que deseas finalizar este turno?")) {
      return;
    }

    try {
      await actualizarTurno(turnoId, {
        estado: "atendido",
        fechaFinAtencion: new Date().toISOString(),
      });
      await cargarTurnos();
      alert("Turno finalizado exitosamente");
    } catch (error) {
      console.error("Error al finalizar turno:", error);
      alert("Error al finalizar turno");
    }
  };

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

  const estadoColors = {
    pendiente: "bg-yellow-100 text-yellow-800",
    "en-atencion": "bg-blue-100 text-blue-800",
    atendido: "bg-green-100 text-green-800",
    ausente: "bg-red-100 text-red-800",
  };

  let turnosFiltrados = turnos;
  if (filtroEstado !== "todos") {
    turnosFiltrados = turnosFiltrados.filter((t) => t.estado === filtroEstado);
  }
  if (filtroTipo !== "todos") {
    turnosFiltrados = turnosFiltrados.filter((t) => t.tipo === filtroTipo);
  }

  if (loading || sucursalLoading || !sucursalSeleccionada) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          🎫 Gestión de Turnos
        </h1>
        <p className="text-gray-600">
          Administra y visualiza todos los turnos del sistema - {sucursalSeleccionada.nombre}
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por Estado
            </label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="en-atencion">En Atención</option>
              <option value="atendido">Atendido</option>
              <option value="ausente">Ausente</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por Tipo
            </label>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos</option>
              <option value="compra">Compras</option>
              <option value="retiro">Retiros</option>
              <option value="devolucion">Devoluciones</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Turnos */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">
            Turnos ({turnosFiltrados.length})
          </h2>
        </div>

        {turnosFiltrados.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No hay turnos con los filtros seleccionados
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4">#</th>
                  <th className="text-left p-4">Cliente</th>
                  <th className="text-left p-4">Tipo</th>
                  <th className="text-left p-4">Estado</th>
                  <th className="text-left p-4">Cajera</th>
                  <th className="text-left p-4">Fecha Creación</th>
                  <th className="text-left p-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(turnosFiltrados) && turnosFiltrados.map((turno) => (
                  <tr
                    key={turno.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="p-4">
                      <span className="text-2xl font-bold text-blue-600">
                        #{turno.numero}
                      </span>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-semibold">{turno.cliente.nombre}</p>
                        <p className="text-sm text-gray-600">
                          {turno.cliente.telefono}
                        </p>
                        {turno.cliente.email && (
                          <p className="text-xs text-gray-500">
                            {turno.cliente.email}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded text-sm font-medium border ${tipoColors[turno.tipo]}`}
                      >
                        {tipoLabels[turno.tipo]}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded text-sm font-medium ${estadoColors[turno.estado]}`}
                      >
                        {turno.estado}
                      </span>
                    </td>
                    <td className="p-4">
                      {turno.cajera ? (
                        <span className="text-sm">
                          {turno.cajera.nombre} ({turno.cajera.codigo})
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">Sin asignar</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="text-sm">
                        {new Date(turno.fechaCreacion).toLocaleString("es-ES")}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/cajera/detalle/${turno.id}`)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        >
                          Ver
                        </button>
                        {turno.estado === "en-atencion" && (
                          <button
                            onClick={() => finalizarTurno(turno.id)}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                          >
                            Finalizar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

