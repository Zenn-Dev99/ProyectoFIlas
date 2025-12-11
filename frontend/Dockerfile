# Dockerfile para Frontend (Next.js)
FROM node:20-alpine AS base

# Instalar dependencias solo en esta etapa
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

# Build de la aplicación
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Imagen de producción
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copiar archivos necesarios para standalone
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Exponer puerto
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Comando de inicio (standalone crea server.js en la raíz)
CMD ["node", "server.js"]

