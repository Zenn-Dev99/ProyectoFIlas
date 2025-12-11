"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { obtenerSucursalPorDefecto, obtenerTodasLasSucursales, obtenerSucursalPorId } from "@/lib/strapi";
import { useAuth } from "./AuthContext";

interface Sucursal {
  id: number;
  nombre: string;
  codigo: string;
  direccion?: string;
  telefono?: string;
  activa: boolean;
  tiempoPromedioAtencion?: number;
}

interface SucursalContextType {
  sucursalSeleccionada: Sucursal | null;
  todasLasSucursales: Sucursal[];
  cambiarSucursal: (sucursalId: number) => Promise<void>;
  loading: boolean;
}

const SucursalContext = createContext<SucursalContextType | undefined>(undefined);

export function SucursalProvider({ children }: { children: ReactNode }) {
  const { usuario } = useAuth();
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState<Sucursal | null>(null);
  const [todasLasSucursales, setTodasLasSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (usuario) {
      cargarSucursales();
    }
  }, [usuario, cargarSucursales]);

  const cargarSucursales = async () => {
    try {
      // Cargar todas las sucursales
      const sucursales = await obtenerTodasLasSucursales();
      
      // Filtrar según permisos del usuario
      let sucursalesDisponibles = sucursales;
      if (usuario?.rol === "jefe_sucursal" && usuario.sucursal) {
        sucursalesDisponibles = sucursales.filter(s => s.id === usuario.sucursal!.id);
      }
      
      setTodasLasSucursales(sucursalesDisponibles);

      // Si es jefe de sucursal, usar su sucursal asignada
      if (usuario?.rol === "jefe_sucursal" && usuario.sucursal) {
        setSucursalSeleccionada(usuario.sucursal);
        localStorage.setItem("sucursalSeleccionadaId", usuario.sucursal.id.toString());
        setLoading(false);
        return;
      }

      // Obtener sucursal guardada en localStorage o usar la por defecto
      const sucursalIdGuardada = localStorage.getItem("sucursalSeleccionadaId");
      
      if (sucursalIdGuardada) {
        const sucursal = await obtenerSucursalPorId(parseInt(sucursalIdGuardada));
        if (sucursal && sucursal.activa) {
          // Verificar que el usuario tenga permiso para ver esta sucursal
          if (usuario?.rol === "jefe_general" || (usuario?.rol === "jefe_sucursal" && usuario.sucursal?.id === sucursal.id)) {
            setSucursalSeleccionada(sucursal);
            setLoading(false);
            return;
          }
        }
      }

      // Si no hay sucursal guardada o no es válida, usar la por defecto
      const sucursalPorDefecto = await obtenerSucursalPorDefecto();
      if (sucursalPorDefecto) {
        setSucursalSeleccionada(sucursalPorDefecto);
        localStorage.setItem("sucursalSeleccionadaId", sucursalPorDefecto.id.toString());
      }
    } catch (error) {
      console.error("Error al cargar sucursales:", error);
    } finally {
      setLoading(false);
    }
  };

  const cambiarSucursal = async (sucursalId: number) => {
    try {
      const sucursal = await obtenerSucursalPorId(sucursalId);
      if (sucursal) {
        setSucursalSeleccionada(sucursal);
        localStorage.setItem("sucursalSeleccionadaId", sucursalId.toString());
      }
    } catch (error) {
      console.error("Error al cambiar sucursal:", error);
    }
  };

  return (
    <SucursalContext.Provider
      value={{
        sucursalSeleccionada,
        todasLasSucursales,
        cambiarSucursal,
        loading,
      }}
    >
      {children}
    </SucursalContext.Provider>
  );
}

export function useSucursal() {
  const context = useContext(SucursalContext);
  if (context === undefined) {
    throw new Error("useSucursal debe usarse dentro de un SucursalProvider");
  }
  return context;
}

