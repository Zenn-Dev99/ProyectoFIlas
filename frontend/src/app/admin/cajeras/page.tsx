"use client";

import { useState, useEffect, useCallback } from "react";
import { obtenerTodasLasCajeras, crearCajera, eliminarCajera } from "@/lib/strapi";
import { useSucursal } from "@/contexts/SucursalContext";

interface Cajera {
  id: number;
  nombre: string;
  codigo: string;
  activa: boolean;
}

export default function AdminCajerasPage() {
  const { sucursalSeleccionada, loading: sucursalLoading } = useSucursal();
  const [cajeras, setCajeras] = useState<Cajera[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevaCajera, setNuevaCajera] = useState({ nombre: "", codigo: "" });
  const [creando, setCreando] = useState(false);
  const [eliminando, setEliminando] = useState<number | null>(null);

  const cargarCajeras = useCallback(async () => {
    if (!sucursalSeleccionada) {
      setLoading(false);
      return;
    }

    try {
      const cajerasData = await obtenerTodasLasCajeras(sucursalSeleccionada.id);
      setCajeras(cajerasData);
    } catch (error) {
      console.error("Error al cargar cajeras:", error);
    } finally {
      setLoading(false);
    }
  }, [sucursalSeleccionada]);

  useEffect(() => {
    if (!sucursalLoading && sucursalSeleccionada) {
      cargarCajeras();
    }
  }, [sucursalSeleccionada, sucursalLoading, cargarCajeras]);

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sucursalSeleccionada || !nuevaCajera.nombre || !nuevaCajera.codigo) {
      alert("Por favor, completa todos los campos");
      return;
    }

    setCreando(true);
    try {
      await crearCajera({
        nombre: nuevaCajera.nombre,
        codigo: nuevaCajera.codigo,
        sucursal: sucursalSeleccionada.id,
        activa: true,
      });
      await cargarCajeras();
      setNuevaCajera({ nombre: "", codigo: "" });
      setMostrarFormulario(false);
      alert("Cajera creada exitosamente");
    } catch (error) {
      console.error("Error al crear cajera:", error);
      alert("Error al crear cajera");
    } finally {
      setCreando(false);
    }
  };

  const handleEliminar = async (cajeraId: number, nombre: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar a ${nombre}? Esta acción no se puede deshacer.`)) {
      return;
    }

    setEliminando(cajeraId);
    try {
      await eliminarCajera(cajeraId);
      await cargarCajeras();
      alert("Cajera eliminada exitosamente");
    } catch (error) {
      console.error("Error al eliminar cajera:", error);
      alert("Error al eliminar cajera");
    } finally {
      setEliminando(null);
    }
  };

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
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            👥 Gestión de Cajeras
          </h1>
          <p className="text-gray-600">
            Crea, edita y elimina cajeras del sistema - {sucursalSeleccionada.nombre}
          </p>
        </div>
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          {mostrarFormulario ? "❌ Cancelar" : "➕ Nueva Cajera"}
        </button>
      </div>

      {/* Formulario de Nueva Cajera */}
      {mostrarFormulario && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Crear Nueva Cajera</h2>
          <form onSubmit={handleCrear} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Cajera
                </label>
                <input
                  type="text"
                  value={nuevaCajera.nombre}
                  onChange={(e) =>
                    setNuevaCajera({ ...nuevaCajera, nombre: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: María González"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código
                </label>
                <input
                  type="text"
                  value={nuevaCajera.codigo}
                  onChange={(e) =>
                    setNuevaCajera({ ...nuevaCajera, codigo: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: CAJ-001"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={creando}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:bg-gray-400"
            >
              {creando ? "Creando..." : "✅ Crear Cajera"}
            </button>
          </form>
        </div>
      )}

      {/* Lista de Cajeras */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">
          Cajeras ({cajeras.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.isArray(cajeras) && cajeras.map((cajera) => (
            <div
              key={cajera.id}
              className={`p-4 border-2 rounded-lg ${
                cajera.activa
                  ? "border-green-300 bg-green-50"
                  : "border-gray-300 bg-gray-50"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {cajera.nombre}
                  </h3>
                  <p className="text-sm text-gray-600">{cajera.codigo}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    cajera.activa
                      ? "bg-green-200 text-green-800"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {cajera.activa ? "Activa" : "Inactiva"}
                </span>
              </div>
              <button
                onClick={() => handleEliminar(cajera.id, cajera.nombre)}
                disabled={eliminando === cajera.id}
                className="w-full mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {eliminando === cajera.id ? "Eliminando..." : "🗑️ Eliminar"}
              </button>
            </div>
          ))}
        </div>
        {cajeras.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No hay cajeras registradas
          </div>
        )}
      </div>
    </div>
  );
}

