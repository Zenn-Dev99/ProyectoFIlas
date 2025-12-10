/**
 * Script para poblar Strapi con datos de prueba usando la API REST
 * 
 * Ejecutar desde la raíz del proyecto:
 * node scripts/seed-strapi.js
 * 
 * IMPORTANTE: Necesitas tener un token de API de Strapi
 * Obtén uno en: http://localhost:1337/admin/settings/api-tokens
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

async function seedData() {
  console.log('🌱 Iniciando seed de datos...\n');

  try {
    // 1. Crear Sucursal
    console.log('📍 Creando sucursal...');
    const sucursal = await fetchAPI('/sucursales', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          nombre: 'Sucursal Principal',
          codigo: 'SUC-001',
          direccion: 'Av. Principal 123, Ciudad',
          telefono: '+56912345678',
          turnoActual: 0,
          tiempoPromedioAtencion: 5,
          activa: true,
        },
      }),
    });
    console.log(`✅ Sucursal creada: ${sucursal.data.nombre} (ID: ${sucursal.data.id})\n`);

    // 2. Crear Cajeras
    console.log('👥 Creando cajeras...');
    const cajeras = [];
    const nombresCajeras = [
      { nombre: 'María González', codigo: 'CAJ-001' },
      { nombre: 'Juan Pérez', codigo: 'CAJ-002' },
      { nombre: 'Ana Martínez', codigo: 'CAJ-003' },
    ];

    for (const cajeraData of nombresCajeras) {
      const cajera = await fetchAPI('/cajeras', {
        method: 'POST',
        body: JSON.stringify({
          data: {
            nombre: cajeraData.nombre,
            codigo: cajeraData.codigo,
            activa: true,
            sucursal: sucursal.data.id,
          },
        }),
      });
      cajeras.push(cajera.data);
      console.log(`✅ Cajera creada: ${cajera.data.nombre} (ID: ${cajera.data.id})`);
    }
    console.log('');

    // 3. Crear Clientes
    console.log('👤 Creando clientes...');
    const clientes = [];
    const datosClientes = [
      { nombre: 'Carlos Rodríguez', telefono: '+56987654321', email: 'carlos@example.com' },
      { nombre: 'Laura Sánchez', telefono: '+56976543210', email: 'laura@example.com' },
      { nombre: 'Pedro López', telefono: '+56965432109', email: 'pedro@example.com' },
      { nombre: 'Sofía Torres', telefono: '+56954321098', email: 'sofia@example.com' },
    ];

    for (const clienteData of datosClientes) {
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
      clientes.push(cliente.data);
      console.log(`✅ Cliente creado: ${cliente.data.nombre} (ID: ${cliente.data.id})`);
    }
    console.log('');

    // 4. Crear Turnos
    console.log('🎫 Creando turnos...');
    const turnos = [];
    const datosTurnos = [
      { cliente: clientes[0], tipo: 'retiro', ordenId: 'ORD-12345', numero: 1 },
      { cliente: clientes[1], tipo: 'compra', numero: 2 },
      { cliente: clientes[2], tipo: 'retiro', ordenId: 'ORD-67890', numero: 3 },
      { cliente: clientes[3], tipo: 'compra', numero: 4 },
    ];

    for (let i = 0; i < datosTurnos.length; i++) {
      const turnoData = datosTurnos[i];
      const turno = await fetchAPI('/turnos', {
        method: 'POST',
        body: JSON.stringify({
          data: {
            numero: turnoData.numero,
            cliente: turnoData.cliente.id,
            sucursal: sucursal.data.id,
            tipo: turnoData.tipo,
            ordenId: turnoData.ordenId || null,
            estado: i === 0 ? 'en-atencion' : 'pendiente',
            posicionEnFila: datosTurnos.length - i,
            tiempoEstimado: (datosTurnos.length - i) * 5,
            fechaCreacion: new Date().toISOString(),
            fechaInicioAtencion: i === 0 ? new Date().toISOString() : null,
            cajera: i === 0 ? cajeras[0].id : null,
            notificado10Numeros: false,
          },
        }),
      });
      turnos.push(turno.data);
      console.log(`✅ Turno creado: #${turno.data.numero} - ${turnoData.cliente.nombre} (${turnoData.tipo})`);
    }
    console.log('');

    // 5. Crear Publicidades
    console.log('📢 Creando publicidades...');
    const publicidades = [];
    const datosPublicidades = [
      {
        titulo: 'Oferta Especial de Verano',
        descripcion: 'Descuentos increíbles en toda la tienda esta semana',
        orden: 1,
      },
      {
        titulo: 'Nuevos Productos Llegaron',
        descripcion: 'Descubre nuestra nueva colección de productos exclusivos',
        orden: 2,
      },
      {
        titulo: 'Programa de Fidelidad',
        descripcion: 'Únete a nuestro programa y obtén beneficios exclusivos',
        orden: 3,
      },
    ];

    for (const pubData of datosPublicidades) {
      const publicidad = await fetchAPI('/publicidades', {
        method: 'POST',
        body: JSON.stringify({
          data: {
            titulo: pubData.titulo,
            descripcion: pubData.descripcion,
            orden: pubData.orden,
            activa: true,
            fechaInicio: new Date().toISOString(),
            fechaFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          },
        }),
      });
      publicidades.push(publicidad.data);
      console.log(`✅ Publicidad creada: ${publicidad.data.titulo}`);
    }
    console.log('');

    console.log('✨ Seed completado exitosamente!\n');
    console.log('📊 Resumen:');
    console.log(`   - 1 Sucursal`);
    console.log(`   - ${cajeras.length} Cajeras`);
    console.log(`   - ${clientes.length} Clientes`);
    console.log(`   - ${turnos.length} Turnos`);
    console.log(`   - ${publicidades.length} Publicidades\n`);

  } catch (error) {
    console.error('❌ Error durante el seed:', error.message);
    if (error.message.includes('401') || error.message.includes('403')) {
      console.error('\n💡 Tip: Necesitas configurar un token de API en Strapi:');
      console.error('   1. Ve a http://localhost:1337/admin/settings/api-tokens');
      console.error('   2. Crea un nuevo token con permisos "Full access"');
      console.error('   3. Ejecuta: STRAPI_API_TOKEN=tu_token node scripts/seed-strapi.js\n');
    }
    process.exit(1);
  }
}

// Ejecutar solo si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  seedData();
}

export default seedData;

