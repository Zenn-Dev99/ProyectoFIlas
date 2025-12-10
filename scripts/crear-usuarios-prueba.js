/**
 * Script para crear usuarios de prueba con diferentes roles
 * 
 * Ejecutar desde la raíz del proyecto:
 * node scripts/crear-usuarios-prueba.js
 * 
 * IMPORTANTE: Necesitas tener un token de API de Strapi con permisos de creación
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

async function crearUsuarios() {
  console.log('👥 Creando usuarios de prueba...\n');

  try {
    // 1. Obtener sucursales existentes
    console.log('📍 Obteniendo sucursales...');
    const sucursalesData = await fetchAPI('/sucursales?populate=*');
    const sucursales = sucursalesData.data || [];
    
    if (sucursales.length === 0) {
      throw new Error('No se encontraron sucursales. Por favor, crea al menos una sucursal primero.');
    }
    console.log(`✅ ${sucursales.length} sucursales encontradas\n`);

    // 2. Crear usuarios de prueba
    const usuarios = [
      // Jefes Generales
      {
        username: 'jefe_general_1',
        email: 'jefe.general1@fila-suite.com',
        password: 'jefe123',
        nombre: 'Carlos Administrador',
        rol: 'jefe_general',
        sucursal: null,
      },
      {
        username: 'jefe_general_2',
        email: 'jefe.general2@fila-suite.com',
        password: 'jefe123',
        nombre: 'Ana Directora',
        rol: 'jefe_general',
        sucursal: null,
      },
      // Jefes de Sucursal (uno por cada sucursal)
      ...sucursales.map((sucursal, index) => ({
        username: `jefe_sucursal_${sucursal.codigo.toLowerCase().replace(/-/g, '_')}`,
        email: `jefe.${sucursal.codigo.toLowerCase().replace(/-/g, '.')}@fila-suite.com`,
        password: 'jefe123',
        nombre: `Jefe ${sucursal.nombre}`,
        rol: 'jefe_sucursal',
        sucursal: sucursal.id,
      })),
    ];

    console.log('🔐 Creando usuarios...\n');
    const usuariosCreados = [];

    for (const usuarioData of usuarios) {
      try {
        // Verificar si el usuario ya existe
        const usuarioExistente = await fetchAPI(`/usuarios?filters[username][$eq]=${usuarioData.username}`);
        if (usuarioExistente.data && usuarioExistente.data.length > 0) {
          console.log(`⏭️  Usuario ya existe: ${usuarioData.username}`);
          usuariosCreados.push(usuarioExistente.data[0]);
          continue;
        }

        // Crear usuario en Strapi Users (para autenticación)
        // Nota: Esto requiere permisos especiales en Strapi
        // Alternativamente, puedes crear usuarios manualmente desde el admin de Strapi
        try {
          const strapiUser = await fetchAPI('/users', {
            method: 'POST',
            body: JSON.stringify({
              username: usuarioData.username,
              email: usuarioData.email,
              password: usuarioData.password,
              confirmed: true,
              blocked: false,
            }),
          });
        } catch (userError) {
          console.warn(`⚠️  No se pudo crear usuario en Strapi Users para ${usuarioData.username}. Puedes crearlo manualmente desde el admin.`);
        }

        // Crear usuario en nuestra colección personalizada
        const usuario = await fetchAPI('/usuarios', {
          method: 'POST',
          body: JSON.stringify({
            data: {
              username: usuarioData.username,
              email: usuarioData.email,
              password: usuarioData.password, // En producción, esto debería estar hasheado
              nombre: usuarioData.nombre,
              rol: usuarioData.rol,
              sucursal: usuarioData.sucursal,
              activo: true,
            },
          }),
        });

        usuariosCreados.push(usuario.data);
        const rolLabel = usuarioData.rol === 'jefe_general' ? '👑 Jefe General' : 
                        usuarioData.rol === 'jefe_sucursal' ? '👔 Jefe Sucursal' : '👤 Cajera';
        console.log(`✅ Usuario creado: ${usuarioData.username} - ${rolLabel}`);
      } catch (error) {
        console.error(`❌ Error al crear usuario ${usuarioData.username}:`, error.message);
      }
    }

    console.log('\n✨ Usuarios creados exitosamente!\n');
    console.log('📊 Resumen:');
    console.log(`   - ${usuariosCreados.filter(u => u.rol === 'jefe_general').length} Jefes Generales`);
    console.log(`   - ${usuariosCreados.filter(u => u.rol === 'jefe_sucursal').length} Jefes de Sucursal`);
    console.log(`   - ${usuariosCreados.filter(u => u.rol === 'cajera').length} Cajeras`);
    console.log(`   - Total: ${usuariosCreados.length} usuarios\n`);

    // Mostrar credenciales
    console.log('🔑 CREDENCIALES DE ACCESO:\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👑 JEFES GENERALES (Pueden ver todas las sucursales):');
    usuariosCreados
      .filter(u => u.rol === 'jefe_general')
      .forEach(u => {
        console.log(`   Usuario: ${u.username}`);
        console.log(`   Contraseña: jefe123`);
        console.log(`   Nombre: ${u.nombre}`);
        console.log('');
      });
    
    console.log('👔 JEFES DE SUCURSAL (Pueden ver solo su sucursal):');
    usuariosCreados
      .filter(u => u.rol === 'jefe_sucursal')
      .forEach(u => {
        console.log(`   Usuario: ${u.username}`);
        console.log(`   Contraseña: jefe123`);
        console.log(`   Nombre: ${u.nombre}`);
        console.log(`   Sucursal: ${u.sucursal?.nombre || 'N/A'}`);
        console.log('');
      });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error durante la creación:', error.message);
    if (error.message.includes('401') || error.message.includes('403')) {
      console.error('\n💡 Tip: Necesitas configurar un token de API en Strapi:');
      console.error('   1. Ve a http://localhost:1337/admin/settings/api-tokens');
      console.error('   2. Crea un nuevo token con permisos "Full access"');
      console.error('   3. Ejecuta: STRAPI_API_TOKEN=tu_token node scripts/crear-usuarios-prueba.js\n');
    } else if (error.message.includes('fetch')) {
      console.error('\n💡 Tip: Asegúrate de que Strapi esté corriendo en http://localhost:1337\n');
    }
    process.exit(1);
  }
}

// Ejecutar
crearUsuarios();

