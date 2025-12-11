/**
 * usuario router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::usuario.usuario', {
  config: {
    find: {
      auth: false,
    },
    findOne: {
      auth: false,
    },
    create: {
      auth: false,
    },
    update: {
      auth: false,
    },
    delete: {
      auth: false,
    },
  },
  routes: [
    {
      method: 'POST',
      path: '/usuarios/login',
      handler: 'usuario.login',
      config: {
        auth: false,
      },
    },
  ],
});
