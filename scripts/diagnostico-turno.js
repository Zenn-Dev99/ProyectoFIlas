/**
 * Script de diagnóstico para verificar el estado de un turno en Strapi
 * Uso: node scripts/diagnostico-turno.js <turnoId>
 */

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

async function diagnosticarTurno(turnoId) {
  console.log(`\n🔍 Diagnosticando turno ID: ${turnoId}\n`);
  console.log(`URL de Strapi: ${STRAPI_URL}\n`);

  try {
    // 1. Intentar obtener el turno directamente
    console.log('1️⃣ Intentando obtener turno directamente...');
    try {
      const response = await fetch(`${STRAPI_URL}/api/turnos/${turnoId}?populate=*`);
      const data = await response.json();
      
      if (response.ok && data.data) {
        console.log('✅ Turno encontrado:');
        console.log(JSON.stringify(data.data, null, 2));
        return;
      } else {
        console.log('❌ No se encontró el turno directamente');
        console.log('Respuesta:', JSON.stringify(data, null, 2));
      }
    } catch (error) {
      console.log('❌ Error al obtener turno:', error.message);
    }

    // 2. Buscar en la lista de turnos
    console.log('\n2️⃣ Buscando en la lista de turnos...');
    try {
      const response = await fetch(`${STRAPI_URL}/api/turnos?populate=*`);
      const data = await response.json();
      
      if (response.ok && data.data) {
        const turno = data.data.find(t => t.id === parseInt(turnoId));
        if (turno) {
          console.log('✅ Turno encontrado en la lista:');
          console.log(JSON.stringify(turno, null, 2));
          console.log('\n⚠️  El turno existe pero no se puede acceder directamente.');
          console.log('   Esto puede indicar que el turno no está publicado (draft).');
        } else {
          console.log('❌ Turno no encontrado en la lista');
          console.log(`Total de turnos: ${data.data.length}`);
          console.log('IDs disponibles:', data.data.map(t => t.id).join(', '));
        }
      } else {
        console.log('❌ Error al obtener lista de turnos');
        console.log('Respuesta:', JSON.stringify(data, null, 2));
      }
    } catch (error) {
      console.log('❌ Error al obtener lista:', error.message);
    }

    // 3. Verificar permisos
    console.log('\n3️⃣ Verificando permisos...');
    console.log('⚠️  Para verificar permisos manualmente:');
    console.log('   1. Ve a Strapi Admin: http://localhost:1337/admin');
    console.log('   2. Settings > Users & Permissions Plugin > Roles');
    console.log('   3. Selecciona "Public"');
    console.log('   4. Busca "Turno" y verifica que "find", "findOne" y "update" estén marcados');

    // 4. Verificar publicación
    console.log('\n4️⃣ Verificando publicación del turno...');
    console.log('⚠️  Si el turno está en estado "draft":');
    console.log('   1. Ve a Strapi Admin > Content Manager > Turno');
    console.log('   2. Busca el turno con ID', turnoId);
    console.log('   3. Si está en "draft", haz clic en "Publish"');

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Obtener ID del turno desde argumentos
const turnoId = process.argv[2];

if (!turnoId) {
  console.log('Uso: node scripts/diagnostico-turno.js <turnoId>');
  console.log('Ejemplo: node scripts/diagnostico-turno.js 8');
  process.exit(1);
}

diagnosticarTurno(turnoId);

