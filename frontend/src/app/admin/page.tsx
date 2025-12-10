"use client";

import { useState, useEffect } from "react";
import { obtenerTodasLasCajeras, getTurnos } from "@/lib/strapi";
import { useSucursal } from "@/contexts/SucursalContext";
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";

interface DashboardStats {
  cajerasActivas: number;
  turnosPendientes: number;
  promedioTiempoEspera: number;
  turnosEnAtencion: number;
  turnosAtendidosHoy: number;
}

export default function AdminDashboard() {
  const { sucursalSeleccionada, loading: sucursalLoading } = useSucursal();
  const [stats, setStats] = useState<DashboardStats>({
    cajerasActivas: 0,
    turnosPendientes: 0,
    promedioTiempoEspera: 0,
    turnosEnAtencion: 0,
    turnosAtendidosHoy: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sucursalLoading && sucursalSeleccionada) {
      cargarDatos();
      const interval = setInterval(cargarDatos, 10000);
      return () => clearInterval(interval);
    }
  }, [sucursalSeleccionada, sucursalLoading]);

  const cargarDatos = async () => {
    if (!sucursalSeleccionada) {
      setLoading(false);
      return;
    }

    try {
      const sucursalId = sucursalSeleccionada.id;

      const todasLasCajeras = await obtenerTodasLasCajeras(sucursal.id);
      const cajerasActivas = todasLasCajeras.filter((c: any) => c.activa).length;

      const turnosData = await getTurnos(sucursal.id);
      const turnos = turnosData.data || [];

      const turnosPendientes = turnos.filter(
        (t: any) => t.estado === "pendiente"
      ).length;

      const turnosEnAtencion = turnos.filter(
        (t: any) => t.estado === "en-atencion"
      ).length;

      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const turnosAtendidosHoy = turnos.filter((t: any) => {
        if (t.estado !== "atendido" || !t.fechaFinAtencion) return false;
        const fechaFin = new Date(t.fechaFinAtencion);
        return fechaFin >= hoy;
      }).length;

      const turnosCompletados = turnos.filter(
        (t: any) =>
          t.estado === "atendido" &&
          t.fechaInicioAtencion &&
          t.fechaFinAtencion
      );

      let promedioTiempoEspera = 0;
      if (turnosCompletados.length > 0) {
        const tiemposAtencion = turnosCompletados.map((t: any) => {
          const inicio = new Date(t.fechaInicioAtencion);
          const fin = new Date(t.fechaFinAtencion);
          return (fin.getTime() - inicio.getTime()) / 1000 / 60;
        });
        const suma = tiemposAtencion.reduce((a: number, b: number) => a + b, 0);
        promedioTiempoEspera = Math.round(suma / tiemposAtencion.length);
      } else {
        promedioTiempoEspera = sucursalSeleccionada.tiempoPromedioAtencion || 5;
      }

      setStats({
        cajerasActivas,
        turnosPendientes,
        promedioTiempoEspera,
        turnosEnAtencion,
        turnosAtendidosHoy,
      });
    } catch (error) {
      console.error("Error al cargar datos del dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || sucursalLoading || !sucursalSeleccionada) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          📊 Dashboard General
        </h1>
        <p className="text-gray-600">
          Vista general del sistema de gestión de filas - {sucursalSeleccionada.nombre}
        </p>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cajeras Activas</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {stats.cajerasActivas}
              </p>
            </div>
            <div className="bg-blue-100 rounded-full p-4">
              <span className="text-3xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Turnos Pendientes</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {stats.turnosPendientes}
              </p>
            </div>
            <div className="bg-yellow-100 rounded-full p-4">
              <span className="text-3xl">⏳</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tiempo Promedio</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {stats.promedioTiempoEspera} min
              </p>
            </div>
            <div className="bg-green-100 rounded-full p-4">
              <span className="text-3xl">⏱️</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En Atención</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {stats.turnosEnAtencion}
              </p>
            </div>
            <div className="bg-purple-100 rounded-full p-4">
              <span className="text-3xl">🎯</span>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas Adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            📈 Turnos Atendidos Hoy
          </h3>
          <p className="text-4xl font-bold text-green-600">
            {stats.turnosAtendidosHoy}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Total de turnos completados el día de hoy
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            ⏰ Tiempo Estimado Total
          </h3>
          <p className="text-4xl font-bold text-blue-600">
            {stats.turnosPendientes * stats.promedioTiempoEspera} min
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Tiempo estimado para atender todos los turnos pendientes
          </p>
        </div>
      </div>
    </div>
  );
}

