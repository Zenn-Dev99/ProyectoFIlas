"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { loginUsuario, obtenerUsuarioActual } from "@/lib/strapi";
import { useRouter } from "next/navigation";

interface Usuario {
  id: number;
  username: string;
  email: string;
  nombre: string;
  rol: "jefe_general" | "jefe_sucursal" | "cajera";
  sucursal?: {
    id: number;
    nombre: string;
    codigo: string;
  } | null;
  activo: boolean;
}

interface AuthContextType {
  usuario: Usuario | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  tienePermiso: (rol: string | string[]) => boolean;
  puedeVerSucursal: (sucursalId: number) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    verificarSesion();
  }, []);

  const verificarSesion = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setLoading(false);
        return;
      }

      const usuarioData = await obtenerUsuarioActual();
      if (usuarioData) {
        // Obtener datos completos del usuario desde la API de usuarios
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}/api/usuarios?filters[username][$eq]=${usuarioData.username}&populate=*`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          setUsuario(data.data[0]);
        }
      }
    } catch (error) {
      console.error("Error al verificar sesión:", error);
      localStorage.removeItem("authToken");
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Primero intentar login con Strapi Users
      let jwt = null;
      try {
        const response = await loginUsuario(username, password);
        if (response.jwt) {
          jwt = response.jwt;
          localStorage.setItem("authToken", jwt);
        }
      } catch (strapiError) {
        // Si falla, intentar buscar en nuestra colección personalizada
        console.log("Intentando login alternativo...");
      }

      // Obtener datos del usuario desde nuestra colección personalizada
      const token = jwt || localStorage.getItem("authToken");
      const usuarioResponse = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}/api/usuarios?filters[username][$eq]=${username}&populate=*`,
        {
          headers: token ? {
            Authorization: `Bearer ${token}`,
          } : {},
        }
      );
      
      if (usuarioResponse.ok) {
        const usuarioData = await usuarioResponse.json();
        if (usuarioData.data && usuarioData.data.length > 0) {
          const usuario = usuarioData.data[0];
          // Verificar contraseña (en producción esto debería estar hasheado)
          if (usuario.password === password || jwt) {
            if (!jwt) {
              // Si no hay JWT de Strapi, crear uno temporal (solo para desarrollo)
              localStorage.setItem("authToken", "temp_token_" + Date.now());
            }
            setUsuario(usuario);
            return true;
          }
        }
      }

      // Si no se encuentra en usuarios personalizados, intentar login directo
      if (!jwt) {
        const response = await loginUsuario(username, password);
        if (response.jwt && response.user) {
          localStorage.setItem("authToken", response.jwt);
          // Crear usuario básico desde Strapi user
          setUsuario({
            id: response.user.id,
            username: response.user.username,
            email: response.user.email,
            nombre: response.user.username,
            rol: "cajera", // Default
            activo: true,
          });
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUsuario(null);
    router.push("/login");
  };

  const tienePermiso = (rol: string | string[]): boolean => {
    if (!usuario) return false;
    if (Array.isArray(rol)) {
      return rol.includes(usuario.rol);
    }
    return usuario.rol === rol;
  };

  const puedeVerSucursal = (sucursalId: number): boolean => {
    if (!usuario) return false;
    if (usuario.rol === "jefe_general") return true;
    if (usuario.rol === "jefe_sucursal" && usuario.sucursal) {
      return usuario.sucursal?.id === sucursalId;
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        loading,
        login,
        logout,
        tienePermiso,
        puedeVerSucursal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}

