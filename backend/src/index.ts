import type { Core } from '@strapi/strapi';
import seedOnBootstrap from './bootstrap/seed';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    try {
      console.log('🔧 Iniciando bootstrap de Strapi...');
      
      // Registrar ruta personalizada de login
      console.log('📝 Registrando ruta personalizada de login...');
      strapi.server.routes([
        {
          method: 'POST',
          path: '/api/usuarios/login',
          handler: 'api::usuario.usuario.login',
          config: {
            auth: false,
          },
        },
      ]);
      console.log('✅ Ruta de login registrada');

      // Seed automático deshabilitado - usar seed manual cuando sea necesario
      // await seedOnBootstrap(strapi);

      // Log de información del servidor
      console.log('🚀 Strapi iniciado correctamente');
      console.log(`📍 Host: ${strapi.config.get('server.host')}`);
      console.log(`🔌 Port: ${strapi.config.get('server.port')}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      
      // Verificar conexión a la base de datos
      try {
        const db = strapi.db;
        if (db) {
          console.log('✅ Base de datos conectada');
          // Intentar una query simple para verificar
          await db.connection.raw('SELECT 1');
          console.log('✅ Query de prueba a BD exitosa');
        }
      } catch (dbError: any) {
        console.error('❌ Error al verificar conexión a BD:', dbError);
        console.error('   Mensaje:', dbError?.message);
        console.error('   Stack:', dbError?.stack);
        // No lanzar el error, solo loguearlo
      }
      
      console.log('✅ Bootstrap completado exitosamente');
    } catch (error: any) {
      console.error('❌ Error en bootstrap:', error);
      console.error('   Mensaje:', error?.message);
      console.error('   Stack:', error?.stack);
      // No lanzar el error para que Strapi pueda continuar
    }
  },
};
