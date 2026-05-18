# Entregable Final: Tests Funcionales + Docker Image

## Resumen del Entregable

Este documento contiene toda la informacion necesaria para reproducir el proyecto y subir la imagen a DockerHub.

---

## 1. Estructura del Proyecto

```
Entregable_Zambrano_Miguel_76985/
├── src/
│   ├── config/           # Configuraciones (DB, Passport)
│   ├── controllers/      # Controladores de negocio
│   ├── dtos/             # Data Transfer Objects
│   ├── middlewares/      # Middlewares (auth, errors)
│   ├── models/           # Modelos Mongoose
│   ├── repositories/     # Patrón Repository
│   ├── routes/           # Routers Express
│   ├── services/         # Servicios de negocio
│   ├── test/             # Tests funcionales
│   │   ├── mocks/        # Mocks y Fakes
│   │   ├── carts.test.js
│   │   ├── products.test.js
│   │   └── test-db.js
│   ├── utils/            # Utilidades (JWT, Mailer)
│   └── views/            # Plantillas Handlebars
├── scripts/              # Scripts de automatización
├── Dockerfile            # Configuración de imagen Docker
├── docker-compose.yml    # Orquestación con MongoDB
├── .dockerignore         # Archivos excluidos del build
├── package.json          # Dependencias y scripts
└── README.md             # Documentación completa
```

---

## 2. Tests Funcionales

### Archivos creados:

- `src/test/test-db.js` - Configuracion de MongoDB Memory Server
- `src/test/mocks/product.mocks.js` - Fakes para productos
- `src/test/mocks/cart.mocks.js` - Fakes para carritos
- `src/test/products.test.js` - Tests del router de productos
- `src/test/carts.test.js` - Tests del router de carritos

### Comandos para ejecutar:

```bash
# Instalar dependencias de test
npm install

# Ejecutar tests
npm test

# Ejecutar con cobertura
npm run test:coverage
```

### Evidencia de ejecucion:

```
PASS src/test/carts.test.js
  ● Console
    ⚠️ Email no configurado (MAIL_USER/MAIL_PASSWORD faltan)...

PASS src/test/products.test.js

Test Suites: 2 passed, 2 total
Tests:       34 passed, 34 total
Time:        4.294 s
```

### Cobertura de tests:

**Products Router:**
- GET /api/products - Listar productos con paginacion
- GET /api/products/:pid - Obtener producto por ID
- POST /api/products - Crear producto (requiere auth)
- PUT /api/products/:pid - Actualizar producto
- DELETE /api/products/:pid - Eliminar producto
- Casos de borde y validaciones

**Carts Router:**
- GET /api/carts/:cartId - Obtener carrito
- GET /api/carts/ticket/:ticketId - Obtener ticket
- POST /api/carts/:cartId/product - Agregar producto
- PUT /api/carts/:cartId/product/:productId - Actualizar cantidad
- DELETE /api/carts/:cartId/product/:productId - Eliminar producto
- DELETE /api/carts/:cartId - Vaciar carrito
- POST /api/carts/:cartId/purchase - Procesar compra

---

## 3. Dockerfile

```dockerfile
# Multi-stage Dockerfile para Backend E-commerce

# Etapa 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

# Etapa 2: Production
FROM node:20-alpine AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --from=builder /app/src ./src
COPY --from=builder /app/dirname.js ./
COPY --from=builder /app/node_modules ./node_modules
USER node
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1
CMD ["node", "src/app.js"]
```

### Decisiones de optimizacion:

1. **Multi-stage build**: Separa build de production, reduciendo tamano final
2. **node:20-alpine**: Imagen ligera (~120MB vs ~900MB de Ubuntu)
3. **npm ci --only=production**: Solo dependencias de produccion
4. **npm cache clean**: Elimina cache para reducir tamano
5. **USER node**: Ejecuta como usuario no root (seguridad)
6. **HEALTHCHECK**: Monitoreo automatico de disponibilidad

---

## 4. Imagen Docker

### Nombre y tag:
```
miguelzambrano/backend-ecommerce:1.0.0
miguelzambrano/backend-ecommerce:latest
```

### Pasos para construir y subir:

```bash
# 1. Construir imagen localmente
docker build -t backend-ecommerce:1.0.0 .

# 2. Etiquetar para DockerHub
docker tag backend-ecommerce:1.0.0 miguelzambrano/backend-ecommerce:1.0.0
docker tag backend-ecommerce:1.0.0 miguelzambrano/backend-ecommerce:latest

# 3. Iniciar sesion en DockerHub
docker login

# 4. Subir imagen
docker push miguelzambrano/backend-ecommerce:1.0.0
docker push miguelzambrano/backend-ecommerce:latest
```

### URL publica DockerHub:
```
https://hub.docker.com/r/miguelzambrano/backend-ecommerce
```

### Ejecutar la imagen:

```bash
# Pull y run
docker pull miguelzambrano/backend-ecommerce:1.0.0
docker run -d -p 8080:8080 \
  -e URL_MONGODB=mongodb://localhost:27017/ecommerce \
  -e JWT_SECRET=your-secret-key \
  miguelzambrano/backend-ecommerce:1.0.0
```

---

## 5. Instrucciones de Ejecucion

### Construir imagen Docker:
```bash
docker build -t backend-ecommerce:1.0.0 .
```

### Ejecutar contenedor:
```bash
docker run -d -p 8080:8080 \
  -e URL_MONGODB=mongodb://localhost:27017/ecommerce \
  -e JWT_SECRET=your-secret-key \
  --name backend-ecommerce \
  backend-ecommerce:1.0.0
```

### Correr tests:
```bash
npm install
npm test
```

### Con Docker Compose:
```bash
# Editar .env con JWT_SECRET
docker-compose up -d
docker logs -f backend-ecommerce
```

---

## 6. Repositorio GitHub

**URL del repositorio**: https://github.com/miguelzambrano/Entregable_Zambrano_Miguel_76985

### Archivos principales:
- `README.md` - Documentacion completa
- `Dockerfile` - Configuracion de imagen
- `docker-compose.yml` - Orquestacion
- `src/test/` - Tests funcionales

---

## Checklist de Entrega

- [x] Tests funcionales creados y ejecutados (34 passing)
- [x] Dockerfile optimizado con multi-stage build
- [x] docker-compose.yml con MongoDB
- [x] README.md actualizado con todas las secciones
- [x] Scripts de automatizacion creados
- [ ] Imagen subida a DockerHub (requiere ejecutar comandos manualmente)
- [x] Documentacion completa en README

---

## Nota Importante

Docker Desktop no esta ejecutandose en tu sistema. Para subir la imagen a DockerHub, debes:

1. Iniciar Docker Desktop
2. Ejecutar los comandos de build y push proporcionados arriba
3. Verificar en https://hub.docker.com que la imagen fue subida

El proyecto esta completo y listo para ser containerizado.