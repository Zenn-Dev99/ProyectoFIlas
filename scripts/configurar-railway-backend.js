#!/usr/bin/env node

/**
 * Script para generar todas las variables de entorno necesarias para Railway Backend
 * Ejecuta este script y copia el output directamente en Railway
 */

const crypto = require('crypto');

function generarClave() {
  return crypto.randomBytes(32).toString('base64');
}

console.log('\n============================================');
console.log('VARIABLES DE ENTORNO PARA RAILWAY - BACKEND');
console.log('============================================\n');
console.log('Copia estas variables en Railway → Variables → Add Variable\n');

// Generar claves
const appKeys = Array.from({ length: 4 }, () => generarClave()).join(',');
const apiTokenSalt = generarClave();
const adminJwtSecret = generarClave();
const transferTokenSalt = generarClave();
const jwtSecret = generarClave();

console.log('DATABASE_CLIENT=postgres');
console.log('DATABASE_URL=${{Postgres.DATABASE_URL}}');
console.log('NODE_ENV=production');
console.log('HOST=0.0.0.0');
console.log('PORT=${{PORT}}');
console.log('CORS_ORIGIN=*');
console.log('');
console.log('APP_KEYS=' + appKeys);
console.log('API_TOKEN_SALT=' + apiTokenSalt);
console.log('ADMIN_JWT_SECRET=' + adminJwtSecret);
console.log('TRANSFER_TOKEN_SALT=' + transferTokenSalt);
console.log('JWT_SECRET=' + jwtSecret);

console.log('\n============================================');
console.log('NOTAS:');
console.log('- Si usas SQLite, cambia DATABASE_CLIENT=sqlite');
console.log('- CORS_ORIGIN puede ser * o la URL de tu frontend');
console.log('- Guarda estas claves de forma segura');
console.log('============================================\n');

