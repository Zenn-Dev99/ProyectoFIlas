/**
 * Script para poblar Strapi con datos de prueba
 * Ejecutar desde el directorio backend/backend:
 * npm run strapi ts:run src/scripts/seed-data.ts
 */

export default async () => {
  const strapi = (global as any).strapi;

  if (!strapi) {
    console.error('Strapi no está disponible. Asegúrate de ejecutar este script dentro del contexto de Strapi.');
    process.exit(1);
  }

  console.log('🌱 Iniciando seed de datos...\n');

  try {
    // 1. Crear Sucursal
    console.log('📍 Creando sucursal...');
    const sucursal = await strapi.entityService.create('api::sucursal.sucursal', {
      data: {
        nombre: 'Sucursal Principal',
        codigo: 'SUC-001',
        direccion: 'Av. Principal 123, Ciudad',
        telefono: '+56912345678',
        turnoActual: 0,
        tiempoPromedioAtencion: 5,
        activa: true,
        publishedAt: new Date(),
      },
    });
    console.log(`✅ Sucursal creada: ${sucursal.nombre} (ID: ${sucursal.id})\n`);

    // 2. Crear Cajeras
    console.log('👥 Creando cajeras...');
    const cajeras = [];
    const nombresCajeras = [
      { nombre: 'María González', codigo: 'CAJ-001' },
      { nombre: 'Juan Pérez', codigo: 'CAJ-002' },
      { nombre: 'Ana Martínez', codigo: 'CAJ-003' },
    ];

    for (const cajeraData of nombresCajeras) {
      const cajera = await strapi.entityService.create('api::cajera.cajera', {
        data: {
          nombre: cajeraData.nombre,
          codigo: cajeraData.codigo,
          activa: true,
          sucursal: sucursal.id,
          publishedAt: new Date(),
        },
      });
      cajeras.push(cajera);
      console.log(`✅ Cajera creada: ${cajera.nombre} (ID: ${cajera.id})`);
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
      const cliente = await strapi.entityService.create('api::cliente.cliente', {
        data: {
          nombre: clienteData.nombre,
          telefono: clienteData.telefono,
          email: clienteData.email,
          notas: `Cliente de prueba - ${clienteData.nombre}`,
          publishedAt: new Date(),
        },
      });
      clientes.push(cliente);
      console.log(`✅ Cliente creado: ${cliente.nombre} (ID: ${cliente.id})`);
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
      const turno = await strapi.entityService.create('api::turno.turno', {
        data: {
          numero: turnoData.numero,
          cliente: turnoData.cliente.id,
          sucursal: sucursal.id,
          tipo: turnoData.tipo,
          ordenId: turnoData.ordenId || null,
          estado: i === 0 ? 'en-atencion' : 'pendiente', // Primer turno en atención
          posicionEnFila: datosTurnos.length - i,
          tiempoEstimado: (datosTurnos.length - i) * 5,
          fechaCreacion: new Date(),
          fechaInicioAtencion: i === 0 ? new Date() : null,
          cajera: i === 0 ? cajeras[0].id : null, // Primer turno asignado a primera cajera
          notificado10Numeros: false,
          publishedAt: new Date(),
        },
      });
      turnos.push(turno);
      console.log(`✅ Turno creado: #${turno.numero} - ${turnoData.cliente.nombre} (${turnoData.tipo})`);
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
      const publicidad = await strapi.entityService.create('api::publicidad.publicidad', {
        data: {
          titulo: pubData.titulo,
          descripcion: pubData.descripcion,
          orden: pubData.orden,
          activa: true,
          fechaInicio: new Date(),
          fechaFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días desde ahora
          publishedAt: new Date(),
        },
      });
      publicidades.push(publicidad);
      console.log(`✅ Publicidad creada: ${publicidad.titulo}`);
    }
    console.log('');

    console.log('✨ Seed completado exitosamente!\n');
    console.log('📊 Resumen:');
    console.log(`   - 1 Sucursal`);
    console.log(`   - ${cajeras.length} Cajeras`);
    console.log(`   - ${clientes.length} Clientes`);
    console.log(`   - ${turnos.length} Turnos`);
    console.log(`   - ${publicidades.length} Publicidades\n`);

    console.log('🎯 Puedes verificar los datos en:');
    console.log('   http://localhost:1337/admin/content-manager/collection-types/api::sucursal.sucursal');
    console.log('   http://localhost:1337/admin/content-manager/collection-types/api::cajera.cajera');
    console.log('   http://localhost:1337/admin/content-manager/collection-types/api::cliente.cliente');
    console.log('   http://localhost:1337/admin/content-manager/collection-types/api::turno.turno');
    console.log('   http://localhost:1337/admin/content-manager/collection-types/api::publicidad.publicidad\n');

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  }
};

