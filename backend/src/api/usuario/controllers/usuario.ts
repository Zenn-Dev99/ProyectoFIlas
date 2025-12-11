/**
 * usuario controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::usuario.usuario', ({ strapi }) => ({
  async login(ctx) {
    try {
      const { username, password } = ctx.request.body;

      if (!username || !password) {
        return ctx.badRequest('Username and password are required');
      }

      // Buscar usuario por username
      const usuarios = await strapi.entityService.findMany('api::usuario.usuario', {
        filters: { username },
        populate: ['sucursal'],
      });

      if (!usuarios || usuarios.length === 0) {
        return ctx.unauthorized('Invalid credentials');
      }

      const usuario = usuarios[0] as any;

      // Verificar contraseña (en producción debería estar hasheada)
      if (usuario.password !== password) {
        return ctx.unauthorized('Invalid credentials');
      }

      // Verificar que el usuario esté activo
      if (!usuario.activo) {
        return ctx.unauthorized('User is not active');
      }

      // Generar un token simple (en producción usar JWT real)
      const jwt = `custom_${usuario.id}_${Date.now()}`;

      // Retornar usuario con relaciones
      return ctx.send({
        jwt,
        user: {
          id: usuario.id,
          username: usuario.username,
          email: usuario.email,
          nombre: usuario.nombre,
          rol: usuario.rol,
          activo: usuario.activo,
          sucursal: usuario.sucursal || null,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      return ctx.internalServerError('An error occurred during login');
    }
  },
}));
