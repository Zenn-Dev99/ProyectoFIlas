/**
 * Script para poblar Strapi con datos de prueba
 * Incluye: usuarios, sucursales, cajeras, clientes, órdenes y turnos
 * 
 * Uso: node scripts/seed-datos-prueba.js
 */

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin123!';
const API_TOKEN = process.env.STRAPI_API_TOKEN || null; // Opcional: usar API token en lugar de login

// Credenciales simples para testing
const USUARIOS_PRUEBA = [
  {
    username: 'admin',
    password: 'admin123',
    email: 'admin@test.com',
    nombre: 'Administrador General',
    rol: 'jefe_general',
  },
  {
    username: 'jefe1',
    password: 'jefe123',
    email: 'jefe1@test.com',
    nombre: 'Jefe Sucursal 1',
    rol: 'jefe_sucursal',
  },
  {
    username: 'cajera1',
    password: 'cajera123',
    email: 'cajera1@test.com',
    nombre: 'María González',
    rol: 'cajera',
  },
  {
    username: 'cajera2',
    password: 'cajera123',
    email: 'cajera2@test.com',
    nombre: 'Juan Pérez',
    rol: 'cajera',
  },
];

let adminToken = null;

// Función para hacer login como admin o usar API token
async function loginAdmin() {
  // Si hay API token, usarlo directamente
  if (API_TOKEN) {
    adminToken = API_TOKEN;
    console.log('✅ Usando API token para autenticación');
    return adminToken;
  }

  // Si no, intentar login con credenciales
  try {
    const response = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`\n❌ Error de login (${response.status}): ${errorText}`);
      console.error('\n💡 Opciones para solucionar:');
      console.error('   1. Configura las credenciales correctas:');
      console.error(`      ADMIN_EMAIL=tu_email ADMIN_PASSWORD=tu_password node scripts/seed-datos-prueba.js`);
      console.error('   2. O crea un API Token en Strapi y úsalo:');
      console.error(`      STRAPI_API_TOKEN=tu_token node scripts/seed-datos-prueba.js`);
      throw new Error(`Login failed: ${response.status}`);
    }

    const data = await response.json();
    adminToken = data.jwt;
    console.log('✅ Login como admin exitoso');
    return adminToken;
  } catch (error) {
    console.error('❌ Error al hacer login como admin:', error.message);
    throw error;
  }
}

// Función para crear un item en Strapi
async function crearItem(contentType, data) {
  try {
    const response = await fetch(`${STRAPI_URL}/api/${contentType}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ data }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error(`❌ Error al crear ${contentType}:`, error.message);
    throw error;
  }
}

// Función para buscar un item en Strapi
async function buscarItem(contentType, filters = {}) {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      queryParams.append(`filters[${key}][$eq]`, value);
    });

    const response = await fetch(`${STRAPI_URL}/api/${contentType}?${queryParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error(`❌ Error al buscar ${contentType}:`, error.message);
    return [];
  }
}

// Función para publicar un item
async function publicarItem(contentType, id) {
  try {
    const response = await fetch(`${STRAPI_URL}/api/${contentType}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        data: { publishedAt: new Date().toISOString() },
      }),
    });

    if (!response.ok) {
      // Si ya está publicado, no es un error
      if (response.status !== 200) {
        console.warn(`⚠️ No se pudo publicar ${contentType} ${id}`);
      }
    }
  } catch (error) {
    // Ignorar errores de publicación
  }
}

// Función para verificar si ya hay datos en el sistema
async function verificarDatosExistentes() {
  try {
    // Intentar buscar sin autenticación primero (si los permisos públicos están habilitados)
    const response = await fetch(`${STRAPI_URL}/api/sucursales?pagination[limit]=1`);
    if (response.ok) {
      const data = await response.json();
      if (data.data && data.data.length > 0) {
        return true; // Ya hay datos
      }
    }
    return false; // No hay datos
  } catch (error) {
    // Si falla, asumimos que no hay datos o no hay permisos públicos
    return false;
  }
}

async function seed() {
  console.log('🌱 Iniciando seed de datos de prueba...\n');

  try {
    // 0. Verificar si ya hay datos (sin login primero)
    console.log('🔍 Verificando si ya hay datos en el sistema...');
    const hayDatos = await verificarDatosExistentes();
    
    if (hayDatos) {
      console.log('✅ Ya existen datos en el sistema. El seed no es necesario.');
      console.log('💡 Si quieres ejecutar el seed de nuevo, elimina los datos existentes primero.\n');
      process.exit(0);
    }
    
    console.log('📝 No se encontraron datos. Iniciando seed...\n');

    // 1. Login como admin
    await loginAdmin();

    // 2. Crear Sucursales
    console.log('📍 Creando sucursales...');
    const sucursalesExistentes = await buscarItem('sucursales', { codigo: 'SUC-001' });
    let sucursal1, sucursal2;

    if (sucursalesExistentes.length === 0) {
      sucursal1 = await crearItem('sucursales', {
        nombre: 'Sucursal Centro',
        codigo: 'SUC-001',
        direccion: 'Av. Principal 123',
        telefono: '+56912345678',
        activa: true,
        tiempoPromedioAtencion: 5,
        turnoActual: 1, // Iniciar en el turno 1
      });
      await publicarItem('sucursales', sucursal1.id);
      console.log(`✅ Sucursal creada: ${sucursal1.nombre} (ID: ${sucursal1.id})`);

      sucursal2 = await crearItem('sucursales', {
        nombre: 'Sucursal Norte',
        codigo: 'SUC-002',
        direccion: 'Av. Norte 456',
        telefono: '+56987654321',
        activa: true,
        tiempoPromedioAtencion: 7,
        turnoActual: 1, // Iniciar en el turno 1
      });
      await publicarItem('sucursales', sucursal2.id);
      console.log(`✅ Sucursal creada: ${sucursal2.nombre} (ID: ${sucursal2.id})`);
    } else {
      sucursal1 = sucursalesExistentes[0];
      const todasSucursales = await buscarItem('sucursales');
      sucursal2 = todasSucursales.find(s => s.id !== sucursal1.id) || sucursal1;
      console.log(`✅ Usando sucursales existentes`);
    }

    // 3. Crear Cajeras
    console.log('\n👥 Creando cajeras...');
    const cajerasExistentes = await buscarItem('cajeras', { codigo: 'CAJ-001' });
    let cajera1, cajera2;

    if (cajerasExistentes.length === 0) {
      cajera1 = await crearItem('cajeras', {
        nombre: 'María González',
        codigo: 'CAJ-001',
        sucursal: sucursal1.id,
        activa: true,
      });
      await publicarItem('cajeras', cajera1.id);
      console.log(`✅ Cajera creada: ${cajera1.nombre} (ID: ${cajera1.id})`);

      cajera2 = await crearItem('cajeras', {
        nombre: 'Juan Pérez',
        codigo: 'CAJ-002',
        sucursal: sucursal1.id,
        activa: true,
      });
      await publicarItem('cajeras', cajera2.id);
      console.log(`✅ Cajera creada: ${cajera2.nombre} (ID: ${cajera2.id})`);
    } else {
      cajera1 = cajerasExistentes[0];
      const todasCajeras = await buscarItem('cajeras');
      cajera2 = todasCajeras.find(c => c.id !== cajera1.id) || cajera1;
      console.log(`✅ Usando cajeras existentes`);
    }

    // 4. Crear Usuarios
    console.log('\n👤 Creando usuarios...');
    for (const usuarioData of USUARIOS_PRUEBA) {
      const usuariosExistentes = await buscarItem('usuarios', { username: usuarioData.username });
      
      if (usuariosExistentes.length === 0) {
        let usuarioCreado;
        
        // Asignar sucursal y cajera según el rol
        if (usuarioData.rol === 'jefe_sucursal') {
          usuarioCreado = await crearItem('usuarios', {
            ...usuarioData,
            sucursal: sucursal1.id,
            activo: true,
          });
        } else if (usuarioData.rol === 'cajera') {
          // Crear usuario sin la relación cajera (el schema no la tiene definida)
          usuarioCreado = await crearItem('usuarios', {
            ...usuarioData,
            sucursal: sucursal1.id,
            activo: true,
          });
        } else {
          usuarioCreado = await crearItem('usuarios', {
            ...usuarioData,
            activo: true,
          });
        }

        console.log(`✅ Usuario creado: ${usuarioCreado.username} (${usuarioCreado.rol})`);
        console.log(`   Credenciales: ${usuarioCreado.username} / ${usuarioData.password}`);
      } else {
        console.log(`⚠️ Usuario ya existe: ${usuarioData.username}`);
      }
    }

    // 5. Crear Clientes
    console.log('\n👥 Creando clientes...');
    const clientesExistentes = await buscarItem('clientes', { telefono: '+56911111111' });
    let cliente1, cliente2, cliente3;

    if (clientesExistentes.length === 0) {
      cliente1 = await crearItem('clientes', {
        nombre: 'Carlos Rodríguez',
        telefono: '+56911111111',
        email: 'carlos@test.com',
      });
      await publicarItem('clientes', cliente1.id);
      console.log(`✅ Cliente creado: ${cliente1.nombre}`);

      cliente2 = await crearItem('clientes', {
        nombre: 'Ana Martínez',
        telefono: '+56922222222',
        email: 'ana@test.com',
      });
      await publicarItem('clientes', cliente2.id);
      console.log(`✅ Cliente creado: ${cliente2.nombre}`);

      cliente3 = await crearItem('clientes', {
        nombre: 'Luis Fernández',
        telefono: '+56933333333',
        email: 'luis@test.com',
      });
      await publicarItem('clientes', cliente3.id);
      console.log(`✅ Cliente creado: ${cliente3.nombre}`);
    } else {
      const todosClientes = await buscarItem('clientes');
      cliente1 = todosClientes[0] || null;
      cliente2 = todosClientes[1] || cliente1;
      cliente3 = todosClientes[2] || cliente2;
      console.log(`✅ Usando clientes existentes`);
    }

    // 6. Crear Órdenes
    console.log('\n📦 Creando órdenes...');
    const ordenesExistentes = await buscarItem('ordenes', { numeroOrden: 'ORD-001' });
    let orden1, orden2;

    if (ordenesExistentes.length === 0 && cliente1) {
      const fechaCreacion = new Date().toISOString();
      
      orden1 = await crearItem('ordenes', {
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
      });
      await publicarItem('ordenes', orden1.id);
      console.log(`✅ Orden creada: ${orden1.numeroOrden} - Total: $${orden1.total}`);

      orden2 = await crearItem('ordenes', {
        numeroOrden: 'ORD-002',
        cliente: cliente2 ? cliente2.id : cliente1.id,
        productos: [
          { nombre: 'Producto C', cantidad: 3, precio: 12000 },
        ],
        total: 36000,
        estado: 'preparado',
        fechaCreacion: fechaCreacion,
        notas: 'Orden de prueba 2',
      });
      await publicarItem('ordenes', orden2.id);
      console.log(`✅ Orden creada: ${orden2.numeroOrden} - Total: $${orden2.total}`);
    } else {
      const todasOrdenes = await buscarItem('ordenes');
      orden1 = todasOrdenes[0] || null;
      orden2 = todasOrdenes[1] || orden1;
      console.log(`✅ Usando órdenes existentes`);
    }

    // 7. Crear Turnos
    console.log('\n🎫 Creando turnos...');
    if (cliente1 && cliente2 && cliente3) {
      const turnosExistentes = await buscarItem('turnos');
      
      if (turnosExistentes.length < 3) {
        const fechaCreacion = new Date().toISOString();
        
        const turno1 = await crearItem('turnos', {
          numero: 1,
          cliente: cliente1.id,
          sucursal: sucursal1.id,
          tipo: 'compra',
          estado: 'pendiente',
          tiempoEstimado: 5,
          posicionEnFila: 1,
          fechaCreacion: fechaCreacion,
        });
        await publicarItem('turnos', turno1.id);
        console.log(`✅ Turno creado: #${turno1.numero} - ${turno1.tipo} - ${cliente1.nombre}`);

        const turno2 = await crearItem('turnos', {
          numero: 2,
          cliente: cliente2.id,
          sucursal: sucursal1.id,
          tipo: 'retiro',
          orden: orden1 ? orden1.id : null, // Usar relación orden, no ordenId
          estado: 'pendiente',
          tiempoEstimado: 7,
          posicionEnFila: 2,
          fechaCreacion: fechaCreacion,
        });
        await publicarItem('turnos', turno2.id);
        console.log(`✅ Turno creado: #${turno2.numero} - ${turno2.tipo} - ${cliente2.nombre}`);

        const turno3 = await crearItem('turnos', {
          numero: 3,
          cliente: cliente3.id,
          sucursal: sucursal1.id,
          tipo: 'devolucion',
          estado: 'pendiente',
          tiempoEstimado: 10,
          posicionEnFila: 3,
          fechaCreacion: fechaCreacion,
        });
        await publicarItem('turnos', turno3.id);
        console.log(`✅ Turno creado: #${turno3.numero} - ${turno3.tipo} - ${cliente3.nombre}`);
      } else {
        console.log(`✅ Ya existen turnos en el sistema`);
      }
    }

    console.log('\n✅ Seed completado exitosamente!\n');
    console.log('📋 Credenciales para testing:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👑 Jefe General:');
    console.log('   Usuario: admin');
    console.log('   Password: admin123');
    console.log('');
    console.log('👔 Jefe Sucursal:');
    console.log('   Usuario: jefe1');
    console.log('   Password: jefe123');
    console.log('');
    console.log('👤 Cajeras:');
    console.log('   Usuario: cajera1 / Password: cajera123');
    console.log('   Usuario: cajera2 / Password: cajera123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('\n❌ Error durante el seed:', error);
    process.exit(1);
  }
}

// Ejecutar seed
seed();

