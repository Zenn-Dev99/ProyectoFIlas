/**
 * Utilidad para manejar errores de base de datos y mostrar mensajes más claros
 */

export function handleDatabaseError(error: any) {
  if (error instanceof Error) {
    // AggregateError contiene múltiples errores
    if (error.name === 'AggregateError' && 'errors' in error) {
      const aggregateError = error as AggregateError;
      console.error('❌ AggregateError - Múltiples errores:');
      aggregateError.errors.forEach((err, index) => {
        console.error(`   Error ${index + 1}:`, err);
        if (err instanceof Error) {
          console.error(`   Mensaje: ${err.message}`);
          if (err.message.includes('ECONNREFUSED')) {
            console.error('   💡 Problema: No se puede conectar a PostgreSQL');
            console.error('   💡 Solución: Verifica que DATABASE_URL esté configurado');
          } else if (err.message.includes('password authentication failed')) {
            console.error('   💡 Problema: Credenciales de PostgreSQL incorrectas');
            console.error('   💡 Solución: Verifica DATABASE_URL');
          } else if (err.message.includes('does not exist')) {
            console.error('   💡 Problema: La base de datos no existe');
            console.error('   💡 Solución: Verifica que PostgreSQL esté configurado');
          }
        }
      });
    } else {
      console.error('❌ Error de base de datos:', error.message);
      if (error.message.includes('ECONNREFUSED')) {
        console.error('💡 No se puede conectar a PostgreSQL. Verifica DATABASE_URL');
      }
    }
  } else {
    console.error('❌ Error desconocido:', error);
  }
}

