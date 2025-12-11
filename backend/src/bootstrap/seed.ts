/**
 * Script de seed automático que se ejecuta al iniciar Strapi
 * Solo se ejecuta si no hay datos en el sistema
 */

import type { Core } from '@strapi/strapi';

interface SeedData {
  sucursales: any[];
  cajeras: any[];
  usuarios: any[];
  clientes: any[];
  ordenes: any[];
  turnos: any[];
}

const USUARIOS_PRUEBA = [
  {
    username: 'jefe_general_1',
    password: 'admin123',
    email: 'jefe.general@test.com',
    nombre: 'Administrador General',
    rol: 'jefe_general' as const,
  },
  {
    username: 'jefe_sucursal_1',
    password: 'jefe123',
    email: 'jefe.sucursal@test.com',
    nombre: 'Jefe Sucursal 1',
    rol: 'jefe_sucursal' as const,
  },
  {
    username: 'cajera_1',
    password: 'cajera123',
    email: 'cajera1@test.com',
    nombre: 'María González',
    rol: 'cajera' as const,
  },
  {
    username: 'cajera_2',
    password: 'cajera123',
    email: 'cajera2@test.com',
    nombre: 'Juan Pérez',
    rol: 'cajera' as const,
  },
];

async function verificarDatosExistentes(strapi: Core.Strapi): Promise<boolean> {
  try {
    const sucursales = await strapi.entityService.findMany('api::sucursal.sucursal', {
      limit: 1,
    });
    return sucursales && sucursales.length > 0;
  } catch (error) {
    console.error('Error al verificar datos existentes:', error);
    return false;
  }
}

async function ejecutarSeed(strapi: Core.Strapi) {
  console.log('🌱 Iniciando seed automático de datos de prueba...\n');

  try {
    // Verificar si ya hay datos
    const hayDatos = await verificarDatosExistentes(strapi);
    if (hayDatos) {
      console.log('✅ Ya existen datos en el sistema. El seed no es necesario.\n');
      return;
    }

    console.log('📝 No se encontraron datos. Iniciando seed...\n');

    // 1. Crear Sucursales
    console.log('📍 Creando sucursales...');
    const sucursal1 = await strapi.entityService.create('api::sucursal.sucursal', {
      data: {
        nombre: 'Sucursal Centro',
        codigo: 'SUC-001',
        direccion: 'Av. Principal 123',
        telefono: '+56912345678',
        activa: true,
        tiempoPromedioAtencion: 5,
        turnoActual: 1, // Iniciar en el turno 1
        publishedAt: new Date().toISOString(),
      },
    });
    console.log(`✅ Sucursal creada: ${sucursal1.nombre} (ID: ${sucursal1.id}) - Turno actual: ${sucursal1.turnoActual}`);

    const sucursal2 = await strapi.entityService.create('api::sucursal.sucursal', {
      data: {
        nombre: 'Sucursal Norte',
        codigo: 'SUC-002',
        direccion: 'Av. Norte 456',
        telefono: '+56987654321',
        activa: true,
        tiempoPromedioAtencion: 7,
        turnoActual: 1, // Iniciar en el turno 1
        publishedAt: new Date().toISOString(),
      },
    });
    console.log(`✅ Sucursal creada: ${sucursal2.nombre} (ID: ${sucursal2.id}) - Turno actual: ${sucursal2.turnoActual}`);

    // 2. Crear Cajeras
    console.log('\n👥 Creando cajeras...');
    const cajera1 = await strapi.entityService.create('api::cajera.cajera', {
      data: {
        nombre: 'María González',
        codigo: 'CAJ-001',
        sucursal: sucursal1.id,
        activa: true,
        publishedAt: new Date().toISOString(),
      },
    });
    console.log(`✅ Cajera creada: ${cajera1.nombre} (ID: ${cajera1.id})`);

    const cajera2 = await strapi.entityService.create('api::cajera.cajera', {
      data: {
        nombre: 'Juan Pérez',
        codigo: 'CAJ-002',
        sucursal: sucursal1.id,
        activa: true,
        publishedAt: new Date().toISOString(),
      },
    });
    console.log(`✅ Cajera creada: ${cajera2.nombre} (ID: ${cajera2.id})`);

    // 3. Crear Usuarios
    console.log('\n👤 Creando usuarios...');
    for (const usuarioData of USUARIOS_PRUEBA) {
      let usuarioCreado;
      
      // Asignar sucursal según el rol
      if (usuarioData.rol === 'jefe_sucursal') {
        usuarioCreado = await strapi.entityService.create('api::usuario.usuario', {
          data: {
            ...usuarioData,
            sucursal: sucursal1.id,
            activo: true,
          },
        });
      } else if (usuarioData.rol === 'cajera') {
        // Para cajeras, asignar sucursal y relacionar con cajera
        const cajeraAsignada = usuarioData.username === 'cajera_1' ? cajera1 : cajera2;
        usuarioCreado = await strapi.entityService.create('api::usuario.usuario', {
          data: {
            ...usuarioData,
            sucursal: sucursal1.id,
            cajera: cajeraAsignada.id,
            activo: true,
          },
        });
      } else {
        usuarioCreado = await strapi.entityService.create('api::usuario.usuario', {
          data: {
            ...usuarioData,
            activo: true,
          },
        });
      }

      console.log(`✅ Usuario creado: ${usuarioCreado.username} (${usuarioCreado.rol})`);
      console.log(`   Credenciales: ${usuarioCreado.username} / ${usuarioData.password}`);
    }

    // 4. Crear Clientes
    console.log('\n👥 Creando clientes...');
    const cliente1 = await strapi.entityService.create('api::cliente.cliente', {
      data: {
        nombre: 'Carlos Rodríguez',
        telefono: '+56911111111',
        email: 'carlos@test.com',
        publishedAt: new Date().toISOString(),
      },
    });
    console.log(`✅ Cliente creado: ${cliente1.nombre}`);

    const cliente2 = await strapi.entityService.create('api::cliente.cliente', {
      data: {
        nombre: 'Ana Martínez',
        telefono: '+56922222222',
        email: 'ana@test.com',
        publishedAt: new Date().toISOString(),
      },
    });
    console.log(`✅ Cliente creado: ${cliente2.nombre}`);

    const cliente3 = await strapi.entityService.create('api::cliente.cliente', {
      data: {
        nombre: 'Luis Fernández',
        telefono: '+56933333333',
        email: 'luis@test.com',
        publishedAt: new Date().toISOString(),
      },
    });
    console.log(`✅ Cliente creado: ${cliente3.nombre}`);

    // 5. Crear Órdenes
    console.log('\n📦 Creando órdenes...');
    const fechaCreacion = new Date().toISOString();
    
    const orden1 = await strapi.entityService.create('api::orden.orden', {
      data: {
        numeroOrden: 'ORD-001',
        cliente: cliente1.id,
        productos: [
          { nombre: 'Producto A', cantidad: 2, precio: 15000 },
          { nombre: 'Producto B', cantidad: 1, precio: 25000 },
        ],
        total: 55000,
        estado: 'pendiente',
        fechaCreacion: fechaCreacion,
        notas: 'Orden de prueba 1',
        publishedAt: new Date().toISOString(),
      },
    });
    console.log(`✅ Orden creada: ${orden1.numeroOrden} - Total: $${orden1.total}`);

    const orden2 = await strapi.entityService.create('api::orden.orden', {
      data: {
        numeroOrden: 'ORD-002',
        cliente: cliente2.id,
        productos: [
          { nombre: 'Producto C', cantidad: 3, precio: 12000 },
        ],
        total: 36000,
        estado: 'preparado',
        fechaCreacion: fechaCreacion,
        notas: 'Orden de prueba 2',
        publishedAt: new Date().toISOString(),
      },
    });
    console.log(`✅ Orden creada: ${orden2.numeroOrden} - Total: $${orden2.total}`);

    // 6. Crear Turnos (usando la relación orden, no ordenId)
    console.log('\n🎫 Creando turnos...');
    const turno1 = await strapi.entityService.create('api::turno.turno', {
      data: {
        numero: 1,
        cliente: cliente1.id,
        sucursal: sucursal1.id,
        tipo: 'compra',
        estado: 'pendiente',
        tiempoEstimado: 5,
        posicionEnFila: 1,
        fechaCreacion: fechaCreacion,
        publishedAt: new Date().toISOString(),
      },
    });
    console.log(`✅ Turno creado: #${turno1.numero} - ${turno1.tipo} - ${cliente1.nombre}`);

    const turno2 = await strapi.entityService.create('api::turno.turno', {
      data: {
        numero: 2,
        cliente: cliente2.id,
        sucursal: sucursal1.id,
        tipo: 'retiro',
        orden: orden1.id, // Usar relación orden, no ordenId
        estado: 'pendiente',
        tiempoEstimado: 7,
        posicionEnFila: 2,
        fechaCreacion: fechaCreacion,
        publishedAt: new Date().toISOString(),
      } as any, // Type assertion para evitar error de tipos generados
    });
    console.log(`✅ Turno creado: #${turno2.numero} - ${turno2.tipo} - ${cliente2.nombre}`);

    const turno3 = await strapi.entityService.create('api::turno.turno', {
      data: {
        numero: 3,
        cliente: cliente3.id,
        sucursal: sucursal1.id,
        tipo: 'devolucion',
        estado: 'pendiente',
        tiempoEstimado: 10,
        posicionEnFila: 3,
        fechaCreacion: fechaCreacion,
        publishedAt: new Date().toISOString(),
      },
    });
    console.log(`✅ Turno creado: #${turno3.numero} - ${turno3.tipo} - ${cliente3.nombre}`);

    console.log('\n✅ Seed completado exitosamente!\n');
    console.log('📋 Credenciales para testing:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👑 Jefe General:');
    console.log('   Usuario: jefe_general_1');
    console.log('   Password: admin123');
    console.log('');
    console.log('👔 Jefe Sucursal:');
    console.log('   Usuario: jefe_sucursal_1');
    console.log('   Password: jefe123');
    console.log('');
    console.log('👤 Cajeras:');
    console.log('   Usuario: cajera_1 / Password: cajera123');
    console.log('   Usuario: cajera_2 / Password: cajera123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('\n❌ Error durante el seed automático:', error);
    // No lanzar el error para que Strapi pueda iniciar aunque falle el seed
  }
}

export default async function seedOnBootstrap(strapi: Core.Strapi) {
  // Solo ejecutar en producción o cuando se especifique la variable de entorno
  const debeEjecutarSeed = process.env.AUTO_SEED === 'true' || process.env.NODE_ENV === 'production';
  
  if (!debeEjecutarSeed) {
    console.log('⏭️ Seed automático deshabilitado (AUTO_SEED no está en "true" o NODE_ENV no es "production")');
    return;
  }

  // Esperar a que Strapi esté completamente inicializado
  await new Promise(resolve => setTimeout(resolve, 2000));

  await ejecutarSeed(strapi);
}

