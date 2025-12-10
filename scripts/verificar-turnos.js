/**
 * Script para verificar qué turnos existen en Strapi
 * Ejecutar: node scripts/verificar-turnos.js
 */

const STRAPI_URL = 'http://localhost:1337';

async function verificarTurnos() {
  try {
    console.log('🔍 Verificando turnos en Strapi...\n');
    
    const response = await fetch(`${STRAPI_URL}/api/turnos?populate=*`);
    
    if (!response.ok) {
      console.error(`❌ Error ${response.status}: ${response.statusText}`);
      const text = await response.text();
      console.error('Detalles:', text);
      return;
    }
    
    const data = await response.json();
    const turnos = data.data || [];
    
    console.log(`✅ Se encontraron ${turnos.length} turnos:\n`);
    
    if (turnos.length === 0) {
      console.log('⚠️  No hay turnos en la base de datos.');
      console.log('💡 Ejecuta el script de seed: node scripts/seed-strapi-simple.js\n');
      return;
    }
    
    turnos.forEach((turno, index) => {
      console.log(`${index + 1}. Turno #${turno.numero}`);
      console.log(`   ID: ${turno.id}`);
      console.log(`   Cliente: ${turno.cliente?.nombre || 'N/A'}`);
      console.log(`   Tipo: ${turno.tipo}`);
      console.log(`   Estado: ${turno.estado}`);
      console.log(`   Cajera: ${turno.cajera?.nombre || 'Sin asignar'}`);
      console.log('');
    });
    
    console.log('📋 Resumen:');
    console.log(`   - Total turnos: ${turnos.length}`);
    console.log(`   - Pendientes: ${turnos.filter(t => t.estado === 'pendiente').length}`);
    console.log(`   - En atención: ${turnos.filter(t => t.estado === 'en-atencion').length}`);
    console.log(`   - Atendidos: ${turnos.filter(t => t.estado === 'atendido').length}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('fetch')) {
      console.error('\n💡 Asegúrate de que Strapi esté corriendo en http://localhost:1337');
    }
  }
}

verificarTurnos();

