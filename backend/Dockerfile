# Dockerfile para Backend (Strapi)
FROM node:20-alpine

# Instalar dependencias del sistema necesarias para pg y better-sqlite3
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias (usar npm install si no hay package-lock.json)
RUN npm install --only=production && npm cache clean --force

# Copiar el resto de la aplicación
COPY . .

# Crear directorio de uploads
RUN mkdir -p public/uploads

# Build de Strapi
RUN npm run build

# Copiar script de inicio
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh && \
    echo "✅ Script de inicio copiado y con permisos de ejecución"

# Exponer puerto (Railway inyecta PORT automáticamente)
EXPOSE ${PORT:-1337}

# Variables de entorno
ENV NODE_ENV=production
ENV HOST=0.0.0.0

# Comando de inicio (usar script que muestra más información)
# Usar sh explícitamente para asegurar que se ejecute
CMD ["sh", "-c", "echo '🚀 EJECUTANDO SCRIPT DE INICIO...' && /app/start.sh"]

