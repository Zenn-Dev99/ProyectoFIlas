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
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copiar archivos necesarios para standalone
# Next.js standalone incluye todo lo necesario en .next/standalone
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Crear directorio public si no existe (Next.js standalone lo incluye, pero por si acaso)
RUN mkdir -p ./public || true

# Exponer puerto
EXPOSE 3000

# Comando de inicio
# Con standalone, el server.js está en la raíz del directorio standalone
CMD ["node", "server.js"]

