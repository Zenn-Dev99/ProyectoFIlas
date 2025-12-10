/**
 * Script para verificar el estado de Strapi y los permisos
 * Uso: node scripts/verificar-strapi.js
 */

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

async function verificarStrapi() {
  console.log('\n🔍 Verificando estado de Strapi...\n');
  console.log(`URL: ${STRAPI_URL}\n`);

  try {
    // 1. Verificar que Strapi está corriendo
    console.log('1️⃣ Verificando conexión con Strapi...');
    try {
      const healthResponse = await fetch(`${STRAPI_URL}/_health`);
      if (healthResponse.ok) {
        console.log('✅ Strapi está corriendo correctamente');
      } else {
        console.log('⚠️  Strapi responde pero con estado:', healthResponse.status);
      }
    } catch (error) {
      console.log('❌ No se puede conectar con Strapi');
      console.log('   Asegúrate de que Strapi esté corriendo: npm run dev:backend');
      return;
    }

    // 2. Verificar acceso a la API de turnos
    console.log('\n2️⃣ Verificando acceso a la API de turnos...');
    try {
      const response = await fetch(`${STRAPI_URL}/api/turnos?populate=*`);
      const data = await response.json();
      
      if (response.ok && data.data) {
        console.log(`✅ Se pueden listar turnos (${data.data.length} encontrados)`);
        
        // Verificar acceso directo
        if (data.data.length > 0) {
          const primerTurno = data.data[0];
          console.log(`\n3️⃣ Verificando acceso directo a turno ID ${primerTurno.id}...`);
          
          try {
            const directResponse = await fetch(`${STRAPI_URL}/api/turnos/${primerTurno.id}?populate=*`);
            if (directResponse.ok) {
              console.log('✅ Se puede acceder directamente a turnos por ID');
            } else {
              console.log('❌ NO se puede acceder directamente a turnos por ID');
              console.log('   Esto indica que falta el permiso "findOne"');
              console.log('   Solución: Ve a Strapi Admin > Settings > Users & Permissions > Roles > Public');
              console.log('   Y marca "findOne" para "Turno"');
            }
          } catch (error) {
            console.log('❌ Error al verificar acceso directo:', error.message);
          }
          
          // Verificar documentId
          if (primerTurno.documentId) {
            console.log(`\n4️⃣ Verificando acceso con documentId ${primerTurno.documentId}...`);
            try {
              const docResponse = await fetch(`${STRAPI_URL}/api/turnos/${primerTurno.documentId}?populate=*`);
              if (docResponse.ok) {
                console.log('✅ Se puede acceder con documentId');
              } else {
                console.log('❌ NO se puede acceder con documentId');
              }
            } catch (error) {
              console.log('⚠️  Error al verificar documentId:', error.message);
            }
          }
        }
      } else {
        console.log('❌ No se pueden listar turnos');
        console.log('   Respuesta:', JSON.stringify(data, null, 2));
        console.log('\n   Esto indica que falta el permiso "find"');
        console.log('   Solución: Ve a Strapi Admin > Settings > Users & Permissions > Roles > Public');
        console.log('   Y marca "find" para "Turno"');
      }
    } catch (error) {
      console.log('❌ Error al verificar API:', error.message);
    }

    // 3. Resumen y recomendaciones
    console.log('\n📋 Resumen:');
    console.log('   Si ves errores, verifica:');
    console.log('   1. Permisos en Strapi Admin > Settings > Users & Permissions > Roles > Public');
    console.log('   2. Que los turnos estén publicados (no en draft)');
    console.log('   3. Reinicia Strapi después de cambiar permisos');
    console.log('\n   El código ahora usa un fallback que busca en la lista si falla el acceso directo.');
    console.log('   Esto debería funcionar incluso sin el permiso "findOne".\n');

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

verificarStrapi();

