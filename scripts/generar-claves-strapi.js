#!/usr/bin/env node

/**
 * Script para generar claves aleatorias para Strapi
 * Úsalo para generar los valores de APP_KEYS, API_TOKEN_SALT, etc.
 */

const crypto = require('crypto');

function generarClave() {
  return crypto.randomBytes(32).toString('base64');
}

console.log('\n🔑 Claves generadas para Strapi:\n');
console.log('APP_KEYS=' + Array.from({ length: 4 }, () => generarClave()).join(','));
console.log('API_TOKEN_SALT=' + generarClave());
console.log('ADMIN_JWT_SECRET=' + generarClave());
console.log('TRANSFER_TOKEN_SALT=' + generarClave());
console.log('JWT_SECRET=' + generarClave());
console.log('\n💡 Copia estas variables a Railway en la sección de Variables de Entorno\n');


