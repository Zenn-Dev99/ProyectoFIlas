const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

// Exportar fetchAPI para uso en componentes
export async function fetchAPI(path: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${STRAPI_URL}/api${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error: ${response.status} - ${errorText}`);
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('No se puede conectar con Strapi. Asegúrate de que esté corriendo en http://localhost:1337');
    }
    throw error;
  }
}

export async function getTurnos(sucursalId?: number) {
  const filter = sucursalId ? `?filters[sucursal][id][$eq]=${sucursalId}` : '';
  return fetchAPI(`/turnos${filter}&populate=*&sort=numero:asc`);
}

export async function getTurnoActual(sucursalId: number) {
  const data = await fetchAPI(
    `/turnos?filters[sucursal][id][$eq]=${sucursalId}&filters[estado][$eq]=en-atencion&populate=*`
  );
  return data.data?.[0] || null;
}

export async function getPublicidades() {
  return fetchAPI('/publicidades?filters[activa][$eq]=true&sort=orden:asc');
}

export async function crearCliente(clienteData: {
  nombre: string;
  telefono: string;
  email?: string;
  notas?: string;
}) {
  return fetchAPI('/clientes', {
    method: 'POST',
    body: JSON.stringify({ data: clienteData }),
  });
}

export async function buscarClientePorTelefono(telefono: string) {
  const data = await fetchAPI(`/clientes?filters[telefono][$eq]=${telefono}&populate=*`);
  return data.data?.[0] || null;
}

export async function obtenerSucursalPorDefecto() {
  const data = await fetchAPI('/sucursales?filters[activa][$eq]=true&populate=*');
  return data.data?.[0] || null;
}

export async function obtenerTodasLasSucursales() {
  const data = await fetchAPI('/sucursales?populate=*&sort=nombre:asc');
  return data.data || [];
}

export async function obtenerSucursalPorId(sucursalId: number) {
  const data = await fetchAPI(`/sucursales/${sucursalId}?populate=*`);
  return data.data || null;
}

export async function obtenerUltimoNumeroTurno(sucursalId: number) {
  const data = await fetchAPI(
    `/turnos?filters[sucursal][id][$eq]=${sucursalId}&sort=numero:desc&pagination[limit]=1&populate=*`
  );
  return data.data?.[0]?.numero || 0;
}

export async function calcularPosicionEnFila(sucursalId: number) {
  const data = await fetchAPI(
    `/turnos?filters[sucursal][id][$eq]=${sucursalId}&filters[estado][$in][0]=pendiente&filters[estado][$in][1]=en-atencion&populate=*`
  );
  return data.data?.length || 0;
}

export async function crearTurno(turnoData: {
  numero: number;
  cliente: number;
  sucursal: number;
  tipo: 'retiro' | 'compra';
  ordenId?: string;
  estado: 'pendiente' | 'en-atencion' | 'atendido' | 'ausente';
  posicionEnFila: number;
  tiempoEstimado?: number;
  fechaCreacion: string;
}) {
  return fetchAPI('/turnos', {
    method: 'POST',
    body: JSON.stringify({ data: turnoData }),
  });
}

export async function getTurnoById(turnoId: number | string) {
  // Siempre buscar primero en la lista (más confiable que acceso directo)
  // Esto evita problemas con permisos findOne
  try {
    const allTurnos = await fetchAPI(`/turnos?populate=*`);
    const turno = allTurnos.data?.find((t: any) => 
      t.id === parseInt(String(turnoId)) || 
      t.documentId === turnoId ||
      String(t.id) === String(turnoId)
    );
    
    if (turno) {
      return turno;
    }
    
    // Si no se encuentra en la lista, intentar acceso directo como último recurso
    try {
      const data = await fetchAPI(`/turnos/${turnoId}?populate=*`);
      return data.data || null;
    } catch (directError) {
      console.warn(`No se pudo obtener turno ${turnoId} ni desde lista ni directamente`);
      return null;
    }
  } catch (error) {
    console.error(`Error al obtener turno ${turnoId}:`, error);
    return null;
  }
}

export async function actualizarTurno(turnoId: number | string, turnoData: any) {
  try {
    // Obtener el turno para verificar que existe y obtener su documentId
    const turnoExistente = await getTurnoById(turnoId);

    if (!turnoExistente) {
      throw new Error(`El turno con ID ${turnoId} no existe o no está publicado en Strapi.`);
    }

    // SIEMPRE usar documentId si está disponible (más confiable en Strapi)
    // Si no hay documentId, usar el id numérico
    const idParaActualizar = turnoExistente.documentId || turnoExistente.id || turnoId;
    
    // Intentar actualizar con el ID encontrado
    const response = await fetchAPI(`/turnos/${idParaActualizar}`, {
      method: 'PUT',
      body: JSON.stringify({ data: turnoData }),
    });
    
    return response;
  } catch (error) {
    console.error(`Error al actualizar turno ${turnoId}:`, error);
    
    // Si el error es 404, intentar con el ID original como último recurso
    if (error instanceof Error && (error.message.includes('404') || error.message.includes('Not Found'))) {
      try {
        console.log(`Intentando actualizar con ID original: ${turnoId}`);
        const response = await fetchAPI(`/turnos/${turnoId}`, {
          method: 'PUT',
          body: JSON.stringify({ data: turnoData }),
        });
        return response;
      } catch (retryError) {
        // Si también falla, lanzar el error original con mensaje mejorado
        throw new Error(
          `No se pudo actualizar el turno ${turnoId}.\n\n` +
          `El turno existe pero no se puede actualizar. Esto puede deberse a:\n` +
          `1. Permisos de "update" no habilitados (aunque ya los configuraste)\n` +
          `2. El turno no está publicado\n` +
          `3. Necesitas reiniciar Strapi después de cambiar permisos\n\n` +
          `Solución rápida: Reinicia Strapi completamente y vuelve a intentar.`
        );
      }
    }
    
    throw error;
  }
}

export async function obtenerCajeras(sucursalId: number) {
  const data = await fetchAPI(`/cajeras?filters[sucursal][id][$eq]=${sucursalId}&filters[activa][$eq]=true&populate=*`);
  return data.data || [];
}

export async function obtenerCajera(cajeraId: number) {
  return fetchAPI(`/cajeras/${cajeraId}?populate=*`);
}

export async function obtenerOrdenPorNumero(numeroOrden: string) {
  const data = await fetchAPI(`/ordenes?filters[numeroOrden][$eq]=${numeroOrden}&populate=*`);
  return data.data?.[0] || null;
}

export async function crearCajera(cajeraData: {
  nombre: string;
  codigo: string;
  sucursal: number;
  activa?: boolean;
}) {
  return fetchAPI('/cajeras', {
    method: 'POST',
    body: JSON.stringify({ 
      data: {
        ...cajeraData,
        activa: cajeraData.activa !== undefined ? cajeraData.activa : true,
      }
    }),
  });
}

export async function obtenerTodasLasCajeras(sucursalId: number) {
  const data = await fetchAPI(`/cajeras?filters[sucursal][id][$eq]=${sucursalId}&populate=*`);
  return data.data || [];
}

export async function eliminarCajera(cajeraId: number) {
  return fetchAPI(`/cajeras/${cajeraId}`, {
    method: 'DELETE',
  });
}

export async function obtenerTodosLosTurnos(sucursalId?: number) {
  const filter = sucursalId ? `?filters[sucursal][id][$eq]=${sucursalId}` : '';
  return fetchAPI(`/turnos${filter}&populate=*&sort=numero:desc`);
}

export async function obtenerClientesFrecuentes(sucursalId?: number) {
  const filter = sucursalId ? `?filters[sucursal][id][$eq]=${sucursalId}` : '';
  const data = await fetchAPI(`/turnos${filter}&populate=*`);
  return data.data || [];
}

// Funciones de autenticación
export async function loginUsuario(username: string, password: string) {
  try {
    // Intentar login con Strapi Users
    const response = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: username,
        password: password,
      }),
    });

    if (!response.ok) {
      throw new Error('Credenciales incorrectas');
    }

    return await response.json();
  } catch (error) {
    // Si falla, intentar con nuestra colección personalizada
    const usuariosResponse = await fetch(
      `${STRAPI_URL}/api/usuarios?filters[username][$eq]=${username}&populate=*`
    );
    
    if (usuariosResponse.ok) {
      const usuariosData = await usuariosResponse.json();
      if (usuariosData.data && usuariosData.data.length > 0) {
        const usuario = usuariosData.data[0];
        if (usuario.password === password) {
          // Retornar formato similar a Strapi auth
          return {
            jwt: 'custom_token_' + Date.now(),
            user: {
              id: usuario.id,
              username: usuario.username,
              email: usuario.email,
            },
          };
        }
      }
    }
    throw error;
  }
}

export async function obtenerUsuarioActual() {
  const token = localStorage.getItem('authToken');
  if (!token) return null;
  
  try {
    const data = await fetchAPI('/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    return null;
  }
}

export async function obtenerUsuarioPorId(usuarioId: number) {
  return fetchAPI(`/usuarios/${usuarioId}?populate=*`);
}
