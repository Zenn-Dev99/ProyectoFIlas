import type { Core } from '@strapi/strapi';

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
    // Registrar ruta personalizada de login usando el router de Koa
    strapi.server.routes([
      {
        method: 'POST',
        path: '/api/usuarios/login',
        handler: async (ctx: any) => {
          const controller = strapi.controller('api::usuario.usuario');
          return await controller.login(ctx);
        },
        config: {
          auth: false,
        },
      },
    ]);
  },
};
