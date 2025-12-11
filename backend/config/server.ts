export default ({ env }) => {
  const port = env.int('PORT', 1337);
  
  // Validar que PORT sea un número válido
  if (isNaN(port) || port < 0 || port > 65535) {
    throw new Error(`Invalid PORT value: ${port}. PORT must be an integer between 0 and 65535.`);
  }
  
  return {
    host: env('HOST', '0.0.0.0'),
    port: port,
    app: {
      keys: env.array('APP_KEYS'),
    },
  };
};
