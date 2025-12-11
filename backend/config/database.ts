import path from 'path';

export default ({ env }) => {
  // Si hay DATABASE_URL, usar PostgreSQL automáticamente (Railway lo proporciona)
  // Si no hay DATABASE_URL pero DATABASE_CLIENT está configurado, usar ese
  // Por defecto usar sqlite para desarrollo local
  const client = env('DATABASE_URL') 
    ? 'postgres' 
    : (env('DATABASE_CLIENT') || 'sqlite');

  const connections = {
    mysql: {
      connection: {
        host: env('DATABASE_HOST', 'localhost'),
        port: env.int('DATABASE_PORT', 3306),
        database: env('DATABASE_NAME', 'strapi'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi'),
        ssl: env.bool('DATABASE_SSL', false) && {
          key: env('DATABASE_SSL_KEY', undefined),
          cert: env('DATABASE_SSL_CERT', undefined),
          ca: env('DATABASE_SSL_CA', undefined),
          capath: env('DATABASE_SSL_CAPATH', undefined),
          cipher: env('DATABASE_SSL_CIPHER', undefined),
          rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
        },
      },
      pool: { min: env.int('DATABASE_POOL_MIN', 2), max: env.int('DATABASE_POOL_MAX', 10) },
    },
    postgres: {
      connection: {
        // Si hay DATABASE_URL (Railway), usarlo directamente
        ...(env('DATABASE_URL') ? {
          connectionString: env('DATABASE_URL'),
          ssl: {
            rejectUnauthorized: false, // Railway PostgreSQL requiere SSL pero con rejectUnauthorized: false
          },
        } : {
          // Si no, usar configuración individual
          host: env('DATABASE_HOST', 'localhost'),
          port: env.int('DATABASE_PORT', 5432),
          database: env('DATABASE_NAME', 'strapi'),
          user: env('DATABASE_USERNAME', 'strapi'),
          password: env('DATABASE_PASSWORD', 'strapi'),
          ssl: env.bool('DATABASE_SSL', false) && {
            key: env('DATABASE_SSL_KEY', undefined),
            cert: env('DATABASE_SSL_CERT', undefined),
            ca: env('DATABASE_SSL_CA', undefined),
            capath: env('DATABASE_SSL_CAPATH', undefined),
            cipher: env('DATABASE_SSL_CIPHER', undefined),
            rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
          },
        }),
        schema: env('DATABASE_SCHEMA', 'public'),
      },
      pool: { min: env.int('DATABASE_POOL_MIN', 2), max: env.int('DATABASE_POOL_MAX', 10) },
    },
    sqlite: {
      connection: {
        filename: path.join(__dirname, '..', '..', env('DATABASE_FILENAME', '.tmp/data.db')),
      },
      useNullAsDefault: true,
    },
  };

  // Log de configuración para debug
  if (process.env.NODE_ENV === 'production') {
    console.log('🔍 Configuración de Base de Datos:');
    console.log(`   Client: ${client}`);
    if (client === 'postgres') {
      if (env('DATABASE_URL')) {
        console.log('   ✅ DATABASE_URL encontrado');
        // No mostrar la URL completa por seguridad, solo indicar que existe
        const dbUrl = env('DATABASE_URL');
        if (dbUrl) {
          const urlObj = new URL(dbUrl);
          console.log(`   Host: ${urlObj.hostname}`);
          console.log(`   Database: ${urlObj.pathname.replace('/', '')}`);
        }
      } else {
        console.log('   ⚠️  DATABASE_URL no encontrado');
        console.log('   Usando configuración individual');
      }
    }
  }

  return {
    connection: {
      client,
      ...connections[client],
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  };
};
