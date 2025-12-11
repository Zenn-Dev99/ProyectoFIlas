/**
 * Script interactivo para ejecutar el seed
 * Pide las credenciales al usuario
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function pregunta(pregunta) {
  return new Promise((resolve) => {
    rl.question(pregunta, (respuesta) => {
      resolve(respuesta);
    });
  });
}

async function main() {
  console.log('🌱 Configuración del Seed de Datos\n');
  
  const strapiUrl = await pregunta('URL de Strapi (Enter para usar Railway): ');
  process.env.STRAPI_URL = strapiUrl || 'https://proyectofilas-production.up.railway.app';
  
  console.log('\nElige método de autenticación:');
  console.log('1. API Token (Recomendado)');
  console.log('2. Credenciales de Admin');
  const metodo = await pregunta('\nOpción (1 o 2): ');
  
  if (metodo === '1') {
    const token = await pregunta('API Token: ');
    process.env.STRAPI_API_TOKEN = token;
  } else {
    const email = await pregunta('Email de admin: ');
    const password = await pregunta('Password de admin: ');
    process.env.ADMIN_EMAIL = email;
    process.env.ADMIN_PASSWORD = password;
  }
  
  rl.close();
  
  console.log('\n🚀 Ejecutando seed...\n');
  
  // Ejecutar el script de seed
  require('./seed-datos-prueba.js');
}

main().catch(console.error);

