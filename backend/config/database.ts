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
          // Railway PostgreSQL requiere SSL con configuración específica
          ssl: process.env.NODE_ENV === 'production' ? {
            rejectUnauthorized: false,
            // Forzar TLS 1.2 o superior
            require: true,
          } : false,
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
  console.log('🔍 Configuración de Base de Datos:');
  console.log(`   Client: ${client}`);
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  
  if (client === 'postgres') {
    const dbUrl = env('DATABASE_URL');
    if (dbUrl) {
      console.log('   ✅ DATABASE_URL encontrado');
      try {
        const urlObj = new URL(dbUrl);
        console.log(`   Host: ${urlObj.hostname}`);
        console.log(`   Port: ${urlObj.port || '5432'}`);
        console.log(`   Database: ${urlObj.pathname.replace('/', '') || 'railway'}`);
        console.log(`   User: ${urlObj.username || 'postgres'}`);
      } catch (urlError) {
        console.error('   ⚠️  Error al parsear DATABASE_URL:', urlError);
        console.log('   DATABASE_URL (primeros 50 chars):', dbUrl.substring(0, 50) + '...');
      }
    } else {
      console.log('   ⚠️  DATABASE_URL no encontrado');
      console.log('   Variables disponibles:');
      console.log(`   DATABASE_CLIENT: ${env('DATABASE_CLIENT')}`);
      console.log(`   DATABASE_HOST: ${env('DATABASE_HOST')}`);
      console.log(`   DATABASE_NAME: ${env('DATABASE_NAME')}`);
      console.log('   Usando configuración individual');
    }
  } else {
    console.log(`   Usando ${client} (desarrollo local)`);
  }

  return {
    connection: {
      client,
      ...connections[client],
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  };
};
