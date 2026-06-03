# Multi-stage build optimizado para Backend E-commerce + Adoption
# Etapa 1: builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

# Etapa 2: production
FROM node:20-alpine AS production
LABEL maintainer="Miguel Zambrano <miguelzjl333@github.com>" \
      org.opencontainers.image.title="backend-ecommerce" \
      org.opencontainers.image.description="API REST e-commerce + modulo adoption" \
      org.opencontainers.image.version="1.0.0"

ENV NODE_ENV=production \
    PORT=8080

WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY --from=builder /app/node_modules ./node_modules
COPY dirname.js ./
COPY src ./src

# Crear directorio de uploads y dar permisos al usuario node
RUN mkdir -p /app/public && chown -R node:node /app
USER node

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

CMD ["node", "src/server.js"]
