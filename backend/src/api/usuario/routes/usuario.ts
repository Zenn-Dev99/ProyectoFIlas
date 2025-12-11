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
  },
});
