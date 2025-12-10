"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SucursalProvider, useSucursal } from "@/contexts/SucursalContext";
import { useAuth } from "@/contexts/AuthContext";

function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { sucursalSeleccionada, todasLasSucursales, cambiarSucursal, loading: sucursalLoading } = useSucursal();
  const { usuario, loading: authLoading, tienePermiso, logout } = useAuth();

  useEffect(() => {
    if (!authLoading && !usuario) {
      router.push("/login");
    } else if (!authLoading && usuario && usuario.rol === "cajera") {
      router.push("/cajera/inicio");
    }
  }, [usuario, authLoading, router]);

  // Filtrar sucursales según permisos
  const sucursalesDisponibles = todasLasSucursales.filter((sucursal) => {
    if (!usuario) return false;
    if (usuario.rol === "jefe_general") return true;
    if (usuario.rol === "jefe_sucursal" && usuario.sucursal) {
      return usuario.sucursal.id === sucursal.id;
    }
    return false;
  });

  const menuItems = [
    { href: "/admin", label: "📊 Dashboard General", icon: "📊" },
    { href: "/admin/turnos", label: "🎫 Gestión de Turnos", icon: "🎫" },
    { href: "/admin/cajeras", label: "👥 Gestión de Cajeras", icon: "👥" },
    { href: "/admin/estadisticas", label: "📈 Estadísticas de Clientes", icon: "📈" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gray-900 text-white transition-all duration-300 fixed h-full`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className={`font-bold text-xl ${!sidebarOpen && "hidden"}`}>
              Fila Suite
            </h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-800 rounded-lg"
            >
              {sidebarOpen ? "←" : "→"}
            </button>
          </div>

          {/* Información del Usuario */}
          {sidebarOpen && usuario && (
            <div className="mb-6 p-3 bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Usuario</p>
              <p className="text-sm font-semibold text-white truncate">
                {usuario.nombre}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {usuario.rol === "jefe_general" && "👑 Jefe General"}
                {usuario.rol === "jefe_sucursal" && "👔 Jefe de Sucursal"}
                {usuario.rol === "cajera" && "👤 Cajera"}
              </p>
              {usuario.sucursal && (
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {usuario.sucursal.nombre}
                </p>
              )}
              <button
                onClick={logout}
                className="mt-2 w-full text-xs text-red-400 hover:text-red-300"
              >
                Cerrar Sesión
              </button>
            </div>
          )}

          {/* Selector de Sucursal */}
          {sidebarOpen && usuario && (usuario.rol === "jefe_general" || usuario.rol === "jefe_sucursal") && (
            <div className="mb-6">
              <label className="block text-xs font-medium text-gray-400 mb-2">
                Sucursal
              </label>
              {sucursalLoading ? (
                <div className="h-10 bg-gray-800 rounded-lg animate-pulse"></div>
              ) : (
                <select
                  value={sucursalSeleccionada?.id || ""}
                  onChange={(e) => cambiarSucursal(parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg text-sm border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={usuario.rol === "jefe_sucursal"}
                >
                  {sucursalesDisponibles.map((sucursal) => (
                    <option key={sucursal.id} value={sucursal.id}>
                      {sucursal.nombre}
                    </option>
                  ))}
                </select>
              )}
              {sucursalSeleccionada && (
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {sucursalSeleccionada.codigo}
                </p>
              )}
            </div>
          )}

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {sidebarOpen && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${sidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SucursalProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SucursalProvider>
  );
}

