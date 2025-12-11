/**
 * Script para crear un API Token en Strapi usando la API directamente
 * Esto evita el bug de la interfaz de administración
 * 
 * Uso: node scripts/crear-api-token.js
 */

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin123!';

// Datos del token a crear
const TOKEN_DATA = {
  name: 'Seed Token',
  description: 'Token para ejecutar el seed manualmente',
  type: 'full-access',
  lifespan: null, // null = sin expiración, o número en milisegundos
};

async function loginAdmin() {
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
      console.error('\n💡 Verifica tus credenciales de administrador');
      throw new Error(`Login failed: ${response.status}`);
    }

    const data = await response.json();
    return data.jwt;
  } catch (error) {
    console.error('❌ Error al hacer login como admin:', error.message);
    throw error;
  }
}

async function crearApiToken(jwt) {
  try {
    const response = await fetch(`${STRAPI_URL}/api/api-tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(TOKEN_DATA),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`\n❌ Error al crear token (${response.status}): ${errorText}`);
      throw new Error(`Failed to create token: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Error al crear API token:', error.message);
    throw error;
  }
}

async function main() {
  console.log('🔑 Creando API Token en Strapi...\n');
  console.log(`📍 URL: ${STRAPI_URL}\n`);

  try {
    // 1. Login como admin
    console.log('🔐 Iniciando sesión como administrador...');
    const jwt = await loginAdmin();
    console.log('✅ Login exitoso\n');

    // 2. Crear API Token
    console.log('🔑 Creando API Token...');
    const tokenData = await crearApiToken(jwt);
    
    console.log('\n✅ API Token creado exitosamente!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Información del Token:');
    console.log(`   Nombre: ${tokenData.name}`);
    console.log(`   Tipo: ${tokenData.type}`);
    console.log(`   ID: ${tokenData.id}`);
    console.log('\n🔐 TOKEN (cópialo ahora, solo se muestra una vez):');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(tokenData.accessKey);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('⚠️  IMPORTANTE: Guarda este token en un lugar seguro.');
    console.log('   No se mostrará de nuevo.\n');

    // Guardar en archivo opcional
    const fs = require('fs');
    const tokenInfo = {
      id: tokenData.id,
      name: tokenData.name,
      type: tokenData.type,
      accessKey: tokenData.accessKey,
      createdAt: new Date().toISOString(),
    };
    fs.writeFileSync('api-token.json', JSON.stringify(tokenInfo, null, 2));
    console.log('💾 Token guardado en: api-token.json\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();

