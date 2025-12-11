"use client";

import { useState, useEffect, useCallback } from "react";
import { obtenerClientesFrecuentes } from "@/lib/strapi";
import { useSucursal } from "@/contexts/SucursalContext";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ClienteFrecuente {
  id: number;
  nombre: string;
  telefono: string;
  cantidadTurnos: number;
  tiposTurnos: {
    compra: number;
    retiro: number;
    devolucion: number;
  };
}

interface EstadisticasTipo {
  tipo: string;
  cantidad: number;
  porcentaje: number;
  [key: string]: string | number;
}

export default function AdminEstadisticasPage() {
  const { sucursalSeleccionada, loading: sucursalLoading } = useSucursal();
  const [clientesFrecuentes, setClientesFrecuentes] = useState<ClienteFrecuente[]>([]);
  const [estadisticasTipo, setEstadisticasTipo] = useState<EstadisticasTipo[]>([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const cargarEstadisticas = useCallback(async () => {
    if (!sucursalSeleccionada) {
      setLoading(false);
      return;
    }

    try {
      const turnos = await obtenerClientesFrecuentes(sucursalSeleccionada.id);

      // Calcular clientes frecuentes
      const clientesMap = new Map<number, {
        nombre: string;
        telefono: string;
        cantidadTurnos: number;
        tiposTurnos: { compra: number; retiro: number; devolucion: number };
      }>();

      turnos.forEach((turno: any) => {
        const clienteId = turno.cliente?.id;
        if (!clienteId) return;

        if (!clientesMap.has(clienteId)) {
          clientesMap.set(clienteId, {
            nombre: turno.cliente.nombre,
            telefono: turno.cliente.telefono,
            cantidadTurnos: 0,
            tiposTurnos: { compra: 0, retiro: 0, devolucion: 0 },
          });
        }

        const cliente = clientesMap.get(clienteId)!;
        cliente.cantidadTurnos++;
        if (turno.tipo === "compra") cliente.tiposTurnos.compra++;
        if (turno.tipo === "retiro") cliente.tiposTurnos.retiro++;
        if (turno.tipo === "devolucion") cliente.tiposTurnos.devolucion++;
      });

      const clientesArray = Array.from(clientesMap.entries())
        .map(([id, data]) => ({
          id,
          ...data,
        }))
        .sort((a, b) => b.cantidadTurnos - a.cantidadTurnos)
        .slice(0, 10); // Top 10 clientes frecuentes

      setClientesFrecuentes(clientesArray);

      // Calcular estadísticas por tipo
      const tiposMap = new Map<string, number>();
      turnos.forEach((turno: any) => {
        const tipo = turno.tipo || "desconocido";
        tiposMap.set(tipo, (tiposMap.get(tipo) || 0) + 1);
      });

      const total = turnos.length;
      const estadisticas = Array.from(tiposMap.entries())
        .map(([tipo, cantidad]) => ({
          tipo: tipo === "compra" ? "Compras" : tipo === "retiro" ? "Retiros" : "Devoluciones",
          cantidad,
          porcentaje: Math.round((cantidad / total) * 100),
        }));

      setEstadisticasTipo(estadisticas);
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    } finally {
      setLoading(false);
    }
  }, [sucursalSeleccionada]);

  useEffect(() => {
    if (!sucursalLoading && sucursalSeleccionada) {
      cargarEstadisticas();
    }
  }, [sucursalSeleccionada, sucursalLoading, cargarEstadisticas]);

  if (loading || sucursalLoading || !sucursalSeleccionada) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          📈 Estadísticas de Clientes
        </h1>
        <p className="text-gray-600">
          Análisis de clientes frecuentes y tipos de pedidos - {sucursalSeleccionada.nombre}
        </p>
      </div>

      {/* Gráfico de Tipos de Pedidos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Tipos de Pedidos (Gráfico de Barras)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={estadisticasTipo}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tipo" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cantidad" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Distribución de Tipos (Gráfico Circular)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={estadisticasTipo}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => `${entry.tipo}: ${entry.porcentaje}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="cantidad"
              >
                {Array.isArray(estadisticasTipo) && estadisticasTipo.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla de Estadísticas por Tipo */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Resumen por Tipo de Pedido
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.isArray(estadisticasTipo) && estadisticasTipo.map((stat) => (
            <div
              key={stat.tipo}
              className="p-4 border-2 border-gray-200 rounded-lg"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {stat.tipo}
              </h3>
              <p className="text-3xl font-bold text-blue-600 mb-1">
                {stat.cantidad}
              </p>
              <p className="text-sm text-gray-600">
                {stat.porcentaje}% del total
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Top 10 Clientes Frecuentes */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">
          Top 10 Clientes Frecuentes
        </h2>
        {clientesFrecuentes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No hay datos de clientes frecuentes
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4">#</th>
                  <th className="text-left p-4">Cliente</th>
                  <th className="text-left p-4">Teléfono</th>
                  <th className="text-left p-4">Total Turnos</th>
                  <th className="text-left p-4">Compras</th>
                  <th className="text-left p-4">Retiros</th>
                  <th className="text-left p-4">Devoluciones</th>
                </tr>
              </thead>
              <tbody>
                {clientesFrecuentes.map((cliente, index) => (
                  <tr
                    key={cliente.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="p-4 font-bold text-gray-600">
                      {index + 1}
                    </td>
                    <td className="p-4 font-semibold">{cliente.nombre}</td>
                    <td className="p-4 text-gray-600">{cliente.telefono}</td>
                    <td className="p-4">
                      <span className="text-xl font-bold text-blue-600">
                        {cliente.cantidadTurnos}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                        {cliente.tiposTurnos.compra}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        {cliente.tiposTurnos.retiro}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-sm">
                        {cliente.tiposTurnos.devolucion}
                      </span>
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

