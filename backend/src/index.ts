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
    // Registrar ruta personalizada de login
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

    // Seed automático deshabilitado - usar seed manual cuando sea necesario
    // await seedOnBootstrap(strapi);

    // Log de información del servidor
    console.log('🚀 Strapi iniciado correctamente');
    console.log(`📍 Host: ${strapi.config.get('server.host')}`);
    console.log(`🔌 Port: ${strapi.config.get('server.port')}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  },
};
