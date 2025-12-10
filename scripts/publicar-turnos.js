/**
 * Script para publicar todos los turnos en Strapi
 * Ejecutar: node scripts/publicar-turnos.js
 */

const STRAPI_URL = 'http://localhost:1337';

async function publicarTurnos() {
  try {
    console.log('📢 Publicando turnos en Strapi...\n');
    
    // Obtener todos los turnos
    const response = await fetch(`${STRAPI_URL}/api/turnos?populate=*`);
    
    if (!response.ok) {
      console.error(`❌ Error ${response.status}: ${response.statusText}`);
      return;
    }
    
    const data = await response.json();
    const turnos = data.data || [];
    
    if (turnos.length === 0) {
      console.log('⚠️  No hay turnos para publicar.');
      return;
    }
    
    console.log(`Encontrados ${turnos.length} turnos.\n`);
    
    // Nota: Para publicar en Strapi v5, necesitas usar el endpoint de publicación
    // que requiere autenticación. Este script solo muestra qué turnos hay.
    
    console.log('📋 Turnos encontrados:');
    turnos.forEach((turno, index) => {
      console.log(`${index + 1}. Turno #${turno.numero} (ID: ${turno.id})`);
      console.log(`   Estado: ${turno.estado}`);
      console.log(`   Publicado: ${turno.publishedAt ? 'Sí' : 'No'}`);
      console.log('');
    });
    
    console.log('💡 Para publicar los turnos:');
    console.log('   1. Ve a Strapi Admin: http://localhost:1337/admin');
    console.log('   2. Content Manager > Turno');
    console.log('   3. Selecciona todos los turnos (checkbox arriba)');
    console.log('   4. Bulk actions > Publish');
    console.log('');
    console.log('   O publica cada turno individualmente haciendo clic en "Publish"');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

publicarTurnos();

