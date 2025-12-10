/**
 * Script para crear usuarios en Strapi Users (sistema de autenticación nativo)
 * 
 * IMPORTANTE: Este script debe ejecutarse DESPUÉS de crear usuarios en la colección personalizada
 * Ejecutar desde la raíz del proyecto:
 * node scripts/crear-usuarios-strapi.js
 */

const STRAPI_URL = 'http://localhost:1337';

// Credenciales del admin de Strapi (cambiar según tu configuración)
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'Admin123!';

async function fetchAPI(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(`${STRAPI_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${response.status} - ${error}`);
  }

  return response.json();
}

async function crearUsuariosStrapi() {
  console.log('🔐 Creando usuarios en Strapi Users...\n');

  try {
    // 1. Login como admin
    console.log('🔑 Iniciando sesión como admin...');
    const loginResponse = await fetchAPI('/admin/login', {
      method: 'POST',
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      }),
    });

    if (!loginResponse.data || !loginResponse.data.token) {
      throw new Error('No se pudo iniciar sesión como admin. Verifica las credenciales.');
    }

    const adminToken = loginResponse.data.token;
    console.log('✅ Sesión iniciada\n');

    // 2. Obtener usuarios de nuestra colección personalizada
    console.log('📋 Obteniendo usuarios de la colección personalizada...');
    const usuariosResponse = await fetchAPI('/api/usuarios?populate=*', {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    const usuarios = usuariosResponse.data || [];
    console.log(`✅ ${usuarios.length} usuarios encontrados\n`);

    // 3. Crear usuarios en Strapi Users
    console.log('👥 Creando usuarios en Strapi Users...\n');
    let creados = 0;
    let existentes = 0;

    for (const usuario of usuarios) {
      try {
        // Verificar si el usuario ya existe en Strapi Users
        const existingUsers = await fetchAPI(`/api/users?filters[username][$eq]=${usuario.username}`, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });

        if (existingUsers.length > 0) {
          console.log(`⏭️  Usuario ya existe en Strapi Users: ${usuario.username}`);
          existentes++;
          continue;
        }

        // Crear usuario en Strapi Users
        const newUser = await fetchAPI('/api/users', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            username: usuario.username,
            email: usuario.email,
            password: usuario.password,
            confirmed: true,
            blocked: false,
          }),
        });

        console.log(`✅ Usuario creado en Strapi Users: ${usuario.username}`);
        creados++;
      } catch (error) {
        console.error(`❌ Error al crear usuario ${usuario.username}:`, error.message);
      }
    }

    console.log('\n✨ Proceso completado!');
    console.log(`   - ${creados} usuarios creados`);
    console.log(`   - ${existentes} usuarios ya existían\n`);

  } catch (error) {
    console.error('❌ Error durante la creación:', error.message);
    console.error('\n💡 Tip: Asegúrate de:');
    console.error('   1. Que Strapi esté corriendo en http://localhost:1337');
    console.error('   2. Que las credenciales de admin sean correctas');
    console.error('   3. Que los usuarios existan en la colección personalizada primero\n');
    process.exit(1);
  }
}

// Ejecutar
crearUsuariosStrapi();

