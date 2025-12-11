"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import TVSkeleton from "@/components/skeletons/TVSkeleton";
import { obtenerSucursalPorDefecto, getPublicidades } from "@/lib/strapi";

interface Publicidad {
  id: string;
  titulo: string;
  imagen: string;
  descripcion?: string;
}

export default function TVPage() {
  const [turnoActual, setTurnoActual] = useState<number | null>(null);
  const [publicidades, setPublicidades] = useState<Publicidad[]>([]);
  const [indicePublicidad, setIndicePublicidad] = useState(0);
  const [loading, setLoading] = useState(true);

  // Número de WhatsApp del bot (configurar en variables de entorno)
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+56930690742";
  // Limpiar el número: remover espacios, guiones, paréntesis y el símbolo +
  const numeroLimpio = whatsappNumber.replace(/[\s\-\(\)\+]/g, "");
  const mensajeInicial = encodeURIComponent("Hola, quiero obtener un turno");
  // Formato correcto para WhatsApp: solo números sin espacios ni símbolos
  const whatsappUrl = `https://wa.me/${numeroLimpio}?text=${mensajeInicial}`;

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Obtener sucursal por defecto y su turno actual
        const sucursal = await obtenerSucursalPorDefecto();
        if (sucursal) {
          setTurnoActual(sucursal.turnoActual || 0);
        }

        // Obtener publicidades de Strapi
        try {
          const publicidadesData = await getPublicidades();
          if (publicidadesData && publicidadesData.data) {
            setPublicidades(publicidadesData.data);
          }
        } catch (error) {
          console.warn("Error al cargar publicidades:", error);
          // Si falla, usar array vacío
          setPublicidades([]);
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setTurnoActual(0);
        setPublicidades([]);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();

    // Actualizar cada 3 segundos para mostrar el turno actual en tiempo real
    const interval = setInterval(() => {
      obtenerSucursalPorDefecto().then((sucursal) => {
        if (sucursal) {
          setTurnoActual(sucursal.turnoActual || 0);
        }
      }).catch(console.error);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (publicidades.length > 0) {
      const interval = setInterval(() => {
        setIndicePublicidad((prev) => (prev + 1) % publicidades.length);
      }, 5000); // Cambiar cada 5 segundos
      return () => clearInterval(interval);
    }
  }, [publicidades.length]);

  if (loading) {
    return <TVSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 text-white">
      <div className="container mx-auto px-8 py-12">
        <div className="grid grid-cols-2 gap-12 items-center mb-12">
          {/* Turno Actual - Grande y Centrado */}
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-4">Turno Actual</h1>
            <div className="text-9xl font-bold text-yellow-400 mb-4">
              {turnoActual !== null ? `#${turnoActual}` : "---"}
            </div>
            <p className="text-2xl">Por favor, acérquese al mostrador</p>
          </div>

          {/* Código QR para WhatsApp */}
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-8">
            <h2 className="text-4xl font-bold mb-4">Obtén tu Turno</h2>
            <p className="text-xl mb-6">Escanea el código QR con WhatsApp</p>
            <div className="flex justify-center mb-4">
              <div className="bg-white p-4 rounded-lg">
                <QRCodeSVG
                  value={whatsappUrl}
                  size={300}
                  level="H"
                  includeMargin={true}
                />
              </div>
            </div>
            <p className="text-lg opacity-90">
              Chatea con nuestro bot para obtener tu turno
            </p>
            <p className="text-sm mt-2 opacity-75">
              No necesitas ingresar tu número manualmente
            </p>
          </div>
        </div>

        {/* Carrusel de Publicidad */}
        {Array.isArray(publicidades) && publicidades.length > 0 && (
          <div className="mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <div className="relative h-96 overflow-hidden rounded-lg">
                <div
                  className="absolute inset-0 transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${indicePublicidad * 100}%)`,
                  }}
                >
                  {publicidades.map((pub, index) => (
                    <div
                      key={pub.id}
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ left: `${index * 100}%` }}
                    >
                      <div className="text-center">
                        <h2 className="text-4xl font-bold mb-4">{pub.titulo}</h2>
                        {pub.descripcion && (
                          <p className="text-2xl">{pub.descripcion}</p>
                        )}
                        <div className="mt-8 bg-white/20 rounded-lg p-4">
                          <div className="w-full h-64 bg-gray-300 rounded flex items-center justify-center">
                            <span className="text-gray-600">
                              {pub.imagen || "Imagen de Publicidad"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Indicadores */}
              <div className="flex justify-center gap-2 mt-4">
                {Array.isArray(publicidades) && publicidades.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setIndicePublicidad(index)}
                    className={`w-3 h-3 rounded-full ${
                      index === indicePublicidad
                        ? "bg-yellow-400"
                        : "bg-white/50"
                    }`}
                    aria-label={`Ir a publicidad ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

