"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { obtenerSucursalPorDefecto, obtenerCajeras, getTurnos } from "@/lib/strapi";
import InicioCajeraSkeleton from "@/components/skeletons/InicioCajeraSkeleton";

interface Cajera {
  id: number;
  nombre: string;
  codigo: string;
}

export default function InicioCajeraPage() {
  const router = useRouter();
  const [cajeras, setCajeras] = useState<Cajera[]>([]);
  const [cajeraSeleccionada, setCajeraSeleccionada] = useState<number | null>(null);
  const [tiposServicio, setTiposServicio] = useState<{
    compra: boolean;
    retiro: boolean;
    devolucion: boolean;
  }>({
    compra: true,
    retiro: true,
    devolucion: true,
  });
  const [loading, setLoading] = useState(true);
  const [turnoActivo, setTurnoActivo] = useState<any>(null);
  const [cajeraActiva, setCajeraActiva] = useState<any>(null);

  useEffect(() => {
    verificarTurnoActivo();
    cargarCajeras();
  }, []);

  const verificarTurnoActivo = async () => {
    try {
      const configStr = localStorage.getItem("cajeraConfig");
      if (!configStr) {
        return;
      }

      const config = JSON.parse(configStr);
      const sucursal = await obtenerSucursalPorDefecto();
      if (!sucursal) return;

      // Verificar si hay turnos en atención para esta cajera
      const turnosData = await getTurnos(sucursal.id);
      const turnos = turnosData.data || [];
      const turnoEnAtencion = turnos.find(
        (t: any) => t.estado === "en-atencion" && t.cajera?.id === config.cajeraId
      );

      if (turnoEnAtencion) {
        // Buscar la cajera activa
        const cajerasData = await obtenerCajeras(sucursal.id);
        const cajera = cajerasData.find((c: any) => c.id === config.cajeraId);
        setCajeraActiva(cajera);
        setTurnoActivo(turnoEnAtencion);
      }
    } catch (error) {
      console.error("Error al verificar turno activo:", error);
    }
  };

  const cargarCajeras = async () => {
    try {
      const sucursal = await obtenerSucursalPorDefecto();
      if (sucursal) {
        const cajerasData = await obtenerCajeras(sucursal.id);
        setCajeras(cajerasData);
      }
    } catch (error) {
      console.error("Error al cargar cajeras:", error);
    } finally {
      setLoading(false);
    }
  };

  const verificarCajeraConTurnoActivo = async (cajeraId: number): Promise<boolean> => {
    try {
      const sucursal = await obtenerSucursalPorDefecto();
      if (!sucursal) return false;

      const turnosData = await getTurnos(sucursal.id);
      const turnos = turnosData.data || [];
      const turnoEnAtencion = turnos.find(
        (t: any) => t.estado === "en-atencion" && t.cajera?.id === cajeraId
      );

      return !!turnoEnAtencion;
    } catch (error) {
      console.error("Error al verificar turno activo:", error);
      return false;
    }
  };

  const finalizarTurno = () => {
    if (confirm("¿Estás seguro de que deseas finalizar tu turno? Deberás iniciar un nuevo turno para continuar.")) {
      localStorage.removeItem("cajeraConfig");
      setTurnoActivo(null);
      setCajeraActiva(null);
      alert("Turno finalizado. Ahora puedes iniciar un nuevo turno.");
    }
  };

  const iniciarTurno = async () => {
    if (!cajeraSeleccionada) {
      alert("Por favor, selecciona una cajera");
      return;
    }

    const alMenosUnTipo = tiposServicio.compra || tiposServicio.retiro || tiposServicio.devolucion;
    if (!alMenosUnTipo) {
      alert("Por favor, selecciona al menos un tipo de servicio");
      return;
    }

    // Verificar si la cajera ya tiene un turno activo
    const tieneTurno = await verificarCajeraConTurnoActivo(cajeraSeleccionada);
    if (tieneTurno) {
      alert("Esta cajera ya tiene un turno activo. Debe finalizar su turno antes de poder iniciar uno nuevo.");
      return;
    }

    // Guardar en localStorage
    const configuracion = {
      cajeraId: cajeraSeleccionada,
      tiposServicio: tiposServicio,
      fechaInicio: new Date().toISOString(),
    };

    localStorage.setItem("cajeraConfig", JSON.stringify(configuracion));

    // Redirigir al panel
    router.push("/cajera");
  };

  if (loading) {
    return <InicioCajeraSkeleton />;
  }

  // Si hay un turno activo, mostrar mensaje y opción de finalizar
  if (turnoActivo && cajeraActiva) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              ⚠️ Turno Activo
            </h1>
            <p className="text-gray-600">
              Ya tienes un turno activo y no puedes seleccionar otro cajero hasta finalizarlo
            </p>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-4">
              Información del Turno Activo
            </h3>
            <div className="space-y-2 text-left">
              <p>
                <strong>Cajera:</strong> {cajeraActiva.nombre} ({cajeraActiva.codigo})
              </p>
              <p>
                <strong>Turno en Atención:</strong> #{turnoActivo.numero}
              </p>
              <p>
                <strong>Cliente:</strong> {turnoActivo.cliente?.nombre || "N/A"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => router.push("/cajera")}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              📋 Ir al Panel de Cajera
            </button>
            <button
              onClick={finalizarTurno}
              className="w-full bg-red-600 text-white py-4 rounded-lg font-bold text-xl hover:bg-red-700 transition-all shadow-lg hover:shadow-xl"
            >
              🛑 Finalizar Turno
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Para seleccionar otro cajero, primero debes finalizar tu turno actual
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Iniciar Turno de Cajera
          </h1>
          <p className="text-gray-600">
            Selecciona tu identidad y los tipos de servicio que atenderás
          </p>
        </div>

        {/* Selector de Cajera */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            👤 Selecciona tu identidad
          </label>
          <select
            value={cajeraSeleccionada || ""}
            onChange={(e) => {
              const cajeraId = parseInt(e.target.value);
              if (cajeraId) {
                // Verificar si esta cajera ya tiene un turno activo
                verificarCajeraConTurnoActivo(cajeraId).then((tieneTurno) => {
                  if (tieneTurno) {
                    alert("Esta cajera ya tiene un turno activo. Debe finalizar su turno antes de poder seleccionarla nuevamente.");
                    setCajeraSeleccionada(null);
                  } else {
                    setCajeraSeleccionada(cajeraId);
                  }
                });
              } else {
                setCajeraSeleccionada(null);
              }
            }}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
          >
            <option value="">-- Selecciona una cajera --</option>
            {Array.isArray(cajeras) && cajeras.map((cajera) => (
              <option key={cajera.id} value={cajera.id}>
                {cajera.nombre} ({cajera.codigo})
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-2">
            ⚠️ Solo puedes seleccionar una cajera a la vez. Para cambiar, debes finalizar el turno actual.
          </p>
        </div>

        {/* Selector de Tipos de Servicio */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            🎯 Tipos de servicio que atenderás
          </label>
          <div className="space-y-3">
            <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={tiposServicio.compra}
                onChange={(e) =>
                  setTiposServicio({ ...tiposServicio, compra: e.target.checked })
                }
                className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
              />
              <div className="ml-3 flex-1">
                <span className="text-lg font-semibold text-gray-800">
                  🛒 Pedidos/Compras
                </span>
                <p className="text-sm text-gray-600">
                  Atender clientes que realizan compras en tienda
                </p>
              </div>
            </label>

            <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={tiposServicio.retiro}
                onChange={(e) =>
                  setTiposServicio({ ...tiposServicio, retiro: e.target.checked })
                }
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <div className="ml-3 flex-1">
                <span className="text-lg font-semibold text-gray-800">
                  📦 Retiros
                </span>
                <p className="text-sm text-gray-600">
                  Atender clientes que retiran pedidos previamente realizados
                </p>
              </div>
            </label>

            <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={tiposServicio.devolucion}
                onChange={(e) =>
                  setTiposServicio({
                    ...tiposServicio,
                    devolucion: e.target.checked,
                  })
                }
                className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
              />
              <div className="ml-3 flex-1">
                <span className="text-lg font-semibold text-gray-800">
                  🔄 Devoluciones
                </span>
                <p className="text-sm text-gray-600">
                  Procesar devoluciones de productos
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Botón de Inicio */}
        <button
          onClick={iniciarTurno}
          disabled={!cajeraSeleccionada}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg font-bold text-xl hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
        >
          ✅ Iniciar Turno
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Tu selección se guardará durante toda la sesión
        </p>
      </div>
    </div>
  );
}

