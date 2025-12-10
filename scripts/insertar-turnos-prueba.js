/**
 * Script para insertar múltiples turnos y clientes de prueba
 * 
 * Ejecutar desde la raíz del proyecto:
 * node scripts/insertar-turnos-prueba.js
 * 
 * IMPORTANTE: Necesitas tener un token de API de Strapi
 * Obtén uno en: http://localhost:1337/admin/settings/api-tokens
 * O ejecuta: STRAPI_API_TOKEN=tu_token node scripts/insertar-turnos-prueba.js
 */

const STRAPI_URL = 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN || ''; // Configurar token aquí o en .env

async function fetchAPI(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(API_TOKEN && { Authorization: `Bearer ${API_TOKEN}` }),
    ...options.headers,
  };

  const response = await fetch(`${STRAPI_URL}/api${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${response.status} - ${error}`);
  }

  return response.json();
}

async function insertarDatosPrueba() {
  console.log('🌱 Iniciando inserción de turnos y clientes de prueba...\n');

  try {
    // 1. Obtener sucursal existente
    console.log('📍 Obteniendo sucursal...');
    const sucursalesData = await fetchAPI('/sucursales?filters[activa][$eq]=true');
    const sucursal = sucursalesData.data?.[0];
    
    if (!sucursal) {
      throw new Error('No se encontró una sucursal activa. Por favor, crea una sucursal primero.');
    }
    console.log(`✅ Sucursal encontrada: ${sucursal.nombre} (ID: ${sucursal.id})\n`);

    // 2. Obtener cajeras existentes
    console.log('👥 Obteniendo cajeras...');
    const cajerasData = await fetchAPI(`/cajeras?filters[sucursal][id][$eq]=${sucursal.id}`);
    const cajeras = cajerasData.data || [];
    console.log(`✅ ${cajeras.length} cajeras encontradas\n`);

    // 3. Obtener último número de turno
    console.log('🔢 Obteniendo último número de turno...');
    const turnosData = await fetchAPI(`/turnos?filters[sucursal][id][$eq]=${sucursal.id}&sort=numero:desc&pagination[limit]=1`);
    const ultimoNumero = turnosData.data?.[0]?.numero || 0;
    console.log(`✅ Último número de turno: ${ultimoNumero}\n`);

    // 4. Crear clientes de prueba
    console.log('👤 Creando clientes de prueba...');
    const clientesPrueba = [
      { nombre: 'Roberto Silva', telefono: '+56911111111', email: 'roberto.silva@example.com' },
      { nombre: 'Carmen Vega', telefono: '+56922222222', email: 'carmen.vega@example.com' },
      { nombre: 'Diego Morales', telefono: '+56933333333', email: 'diego.morales@example.com' },
      { nombre: 'Patricia Ruiz', telefono: '+56944444444', email: 'patricia.ruiz@example.com' },
      { nombre: 'Fernando Castro', telefono: '+56955555555', email: 'fernando.castro@example.com' },
      { nombre: 'Isabel Mendoza', telefono: '+56966666666', email: 'isabel.mendoza@example.com' },
      { nombre: 'Ricardo Herrera', telefono: '+56977777777', email: 'ricardo.herrera@example.com' },
      { nombre: 'Andrea Jiménez', telefono: '+56988888888', email: 'andrea.jimenez@example.com' },
      { nombre: 'Gustavo Ramírez', telefono: '+56999999999', email: 'gustavo.ramirez@example.com' },
      { nombre: 'Valentina Soto', telefono: '+56910101010', email: 'valentina.soto@example.com' },
      { nombre: 'Sebastián Muñoz', telefono: '+56920202020', email: 'sebastian.munoz@example.com' },
      { nombre: 'Camila Díaz', telefono: '+56930303030', email: 'camila.diaz@example.com' },
      { nombre: 'Matías Contreras', telefono: '+56940404040', email: 'matias.contreras@example.com' },
      { nombre: 'Javiera Vargas', telefono: '+56950505050', email: 'javiera.vargas@example.com' },
      { nombre: 'Nicolás Espinoza', telefono: '+56960606060', email: 'nicolas.espinoza@example.com' },
    ];

    const clientesCreados = [];
    for (const clienteData of clientesPrueba) {
      // Verificar si el cliente ya existe
      const clienteExistente = await fetchAPI(`/clientes?filters[telefono][$eq]=${clienteData.telefono}`);
      if (clienteExistente.data && clienteExistente.data.length > 0) {
        console.log(`⏭️  Cliente ya existe: ${clienteData.nombre}`);
        clientesCreados.push(clienteExistente.data[0]);
        continue;
      }

      const cliente = await fetchAPI('/clientes', {
        method: 'POST',
        body: JSON.stringify({
          data: {
            nombre: clienteData.nombre,
            telefono: clienteData.telefono,
            email: clienteData.email,
            notas: `Cliente de prueba - ${clienteData.nombre}`,
          },
        }),
      });
      clientesCreados.push(cliente.data);
      console.log(`✅ Cliente creado: ${cliente.data.nombre} (ID: ${cliente.data.id})`);
    }
    console.log(`\n✅ Total clientes: ${clientesCreados.length}\n`);

    // 5. Crear turnos de prueba con diferentes estados y tipos
    console.log('🎫 Creando turnos de prueba...');
    const tipos = ['compra', 'retiro', 'devolucion'];
    const estados = ['pendiente', 'pendiente', 'pendiente', 'en-atencion', 'atendido', 'atendido'];
    
    const turnosCreados = [];
    let numeroTurno = ultimoNumero + 1;

    for (let i = 0; i < clientesCreados.length; i++) {
      const cliente = clientesCreados[i];
      const tipo = tipos[i % tipos.length];
      const estado = estados[i % estados.length];
      const cajera = cajeras.length > 0 ? cajeras[i % cajeras.length] : null;
      
      // Calcular fechas según el estado
      const ahora = new Date();
      const fechaCreacion = new Date(ahora.getTime() - (i * 10 * 60 * 1000)); // Hace i*10 minutos
      let fechaInicioAtencion = null;
      let fechaFinAtencion = null;

      if (estado === 'en-atencion') {
        fechaInicioAtencion = new Date(ahora.getTime() - (5 * 60 * 1000)); // Hace 5 minutos
      } else if (estado === 'atendido') {
        fechaInicioAtencion = new Date(ahora.getTime() - (30 * 60 * 1000)); // Hace 30 minutos
        fechaFinAtencion = new Date(ahora.getTime() - (25 * 60 * 1000)); // Hace 25 minutos
      }

      const turnoData = {
        numero: numeroTurno++,
        cliente: cliente.id,
        sucursal: sucursal.id,
        tipo: tipo,
        ordenId: tipo === 'retiro' || tipo === 'devolucion' ? `ORD-${String(numeroTurno - 1).padStart(5, '0')}` : null,
        estado: estado,
        posicionEnFila: clientesCreados.length - i,
        tiempoEstimado: (clientesCreados.length - i) * sucursal.tiempoPromedioAtencion,
        fechaCreacion: fechaCreacion.toISOString(),
        fechaInicioAtencion: fechaInicioAtencion ? fechaInicioAtencion.toISOString() : null,
        fechaFinAtencion: fechaFinAtencion ? fechaFinAtencion.toISOString() : null,
        cajera: estado === 'en-atencion' && cajera ? cajera.id : null,
        notificado10Numeros: false,
      };

      const turno = await fetchAPI('/turnos', {
        method: 'POST',
        body: JSON.stringify({ data: turnoData }),
      });
      turnosCreados.push(turno.data);
      
      const tipoLabel = tipo === 'compra' ? 'Compras' : tipo === 'retiro' ? 'Retiros' : 'Devoluciones';
      console.log(`✅ Turno #${turno.data.numero} creado: ${cliente.nombre} - ${tipoLabel} (${estado})`);
    }
    console.log('');

    // 6. Publicar todos los turnos creados (si Strapi tiene draftAndPublish habilitado)
    console.log('📝 Publicando turnos...');
    for (const turno of turnosCreados) {
      try {
        await fetchAPI(`/turnos/${turno.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            data: {
              publishedAt: new Date().toISOString(),
            },
          }),
        });
      } catch (error) {
        // Si falla, probablemente no tiene draftAndPublish habilitado, continuar
      }
    }
    console.log('✅ Turnos publicados\n');

    // Resumen
    console.log('✨ Inserción completada exitosamente!\n');
    console.log('📊 Resumen:');
    console.log(`   - ${clientesCreados.length} Clientes`);
    console.log(`   - ${turnosCreados.length} Turnos creados`);
    
    const turnosPorEstado = turnosCreados.reduce((acc, t) => {
      acc[t.estado] = (acc[t.estado] || 0) + 1;
      return acc;
    }, {});
    console.log('\n   Turnos por estado:');
    Object.entries(turnosPorEstado).forEach(([estado, cantidad]) => {
      console.log(`     - ${estado}: ${cantidad}`);
    });

    const turnosPorTipo = turnosCreados.reduce((acc, t) => {
      acc[t.tipo] = (acc[t.tipo] || 0) + 1;
      return acc;
    }, {});
    console.log('\n   Turnos por tipo:');
    Object.entries(turnosPorTipo).forEach(([tipo, cantidad]) => {
      const tipoLabel = tipo === 'compra' ? 'Compras' : tipo === 'retiro' ? 'Retiros' : 'Devoluciones';
      console.log(`     - ${tipoLabel}: ${cantidad}`);
    });

    console.log('\n');

  } catch (error) {
    console.error('❌ Error durante la inserción:', error.message);
    if (error.message.includes('401') || error.message.includes('403')) {
      console.error('\n💡 Tip: Necesitas configurar un token de API en Strapi:');
      console.error('   1. Ve a http://localhost:1337/admin/settings/api-tokens');
      console.error('   2. Crea un nuevo token con permisos "Full access"');
      console.error('   3. Ejecuta: STRAPI_API_TOKEN=tu_token node scripts/insertar-turnos-prueba.js\n');
    } else if (error.message.includes('fetch')) {
      console.error('\n💡 Tip: Asegúrate de que Strapi esté corriendo en http://localhost:1337\n');
    }
    process.exit(1);
  }
}

// Ejecutar
insertarDatosPrueba();

