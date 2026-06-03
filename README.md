# Backend E-commerce + Adoption - Entregable Final.....

API REST para e-commerce con un módulo adicional de **gestión de adopciones de mascotas**, desarrollado con Node.js, Express y MongoDB. Incluye autenticación con JWT, manejo de carritos, productos y un CRUD completo de adopciones con tests funcionales y Docker.

## Estructura del Proyecto

```
Entregable_Zambrano_Miguel_76985/
├── src/
│   ├── config/                    # Configuración (DB, Passport)
│   ├── controllers/               # Controladores (cart, products, sessions, users, adoption)
│   ├── dtos/                      # Data Transfer Objects
│   ├── middlewares/               # Auth, manejo de errores
│   ├── models/                    # Modelos Mongoose (cart, product, ticket, user, adoption)
│   ├── repositories/              # Capa de persistencia
│   ├── routes/                    # Routers Express
│   │   ├── adoption.router.js     # 🆕 Router de adopciones
│   │   ├── carts.router.js
│   │   ├── products.router.js
│   │   ├── sessions.router.js
│   │   ├── users.router.js
│   │   └── views.router.js
│   ├── services/                  # Lógica de negocio
│   ├── test/                      # Tests funcionales con Jest + Supertest
│   │   ├── adoptions.test.js      # 🆕 21 tests del router adoption
│   │   ├── carts.test.js
│   │   ├── products.test.js
│   │   ├── test-db.js             # Configuración MongoDB Memory Server
│   │   └── mocks/                 # Fakes de datos
│   ├── utils/                     # JWT, Mailer, errores HTTP
│   ├── views/                     # Plantillas Handlebars
│   └── server.js                  # Punto de entrada
├── scripts/                       # Scripts de automatización
├── Dockerfile                     # Imagen multi-stage optimizada
├── docker-compose.yml             # Orquestación con MongoDB
├── .dockerignore                  # Exclusiones del build
├── package.json                   # Dependencias y scripts
└── README.md                      # Este archivo
```

## Tecnologías

- **Runtime**: Node.js 20 (Alpine)
- **Framework**: Express 5.x
- **Base de datos**: MongoDB 6 con Mongoose 8
- **Autenticación**: JWT + Passport
- **Tests**: Jest 29 + Supertest 7 + MongoDB Memory Server
- **Containerización**: Docker (multi-stage build) + Docker Compose

## Requisitos

- Node.js 20+
- npm 10+
- Docker Desktop 4.x
- MongoDB (local, Docker o Atlas)

## Instalación local

```bash
git clone <repo>
cd Entregable_Zambrano_Miguel_76985
npm install
cp .env.example .env
# Editar .env con JWT_PRIVATE_KEY y MONGODB_URI
```

## Variables de Entorno

```env
PORT=8080
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_PRIVATE_KEY=tu_clave_secreta_min_32_caracteres
NODE_ENV=production
```

## Scripts npm

```bash
npm run dev               # Desarrollo con nodemon
npm start                 # Producción
npm test                  # Ejecuta los 55 tests funcionales
npm run test:coverage     # Tests con reporte de cobertura
```

## Tests Funcionales

55 tests en 3 suites, todos pasando:

```bash
npm test
```

Salida:

```
PASS src/test/carts.test.js
PASS src/test/products.test.js
PASS src/test/adoptions.test.js

Test Suites: 3 passed, 3 total
Tests:       55 passed, 55 total
Time:        5.5 s
```

### Cobertura de `adoption.router.js`

- **GET /api/adoptions** - Listado con filtros por status/species
- **GET /api/adoptions/:aid** - Detalle por ID, manejo de IDs inválidos/inexistentes
- **POST /api/adoptions** - Creación (solo admin) + validación de payload
- **POST /api/adoptions/:aid/adopt** - Adopción (solo user) con autenticación
- **PUT /api/adoptions/:aid** - Actualización (solo admin)
- **DELETE /api/adoptions/:aid** - Eliminación (solo admin)
- **Edge cases** - múltiples especies, caracteres especiales, queries combinadas

## Endpoints principales

### Adopciones (`/api/adoptions`)

| Método | Ruta | Auth | Rol | Descripción |
|---|---|---|---|---|
| GET | `/api/adoptions` | No | - | Listar adopciones (filtros: `status`, `species`) |
| GET | `/api/adoptions/:aid` | No | - | Detalle |
| POST | `/api/adoptions` | Sí | admin | Crear |
| PUT | `/api/adoptions/:aid` | Sí | admin | Actualizar |
| DELETE | `/api/adoptions/:aid` | Sí | admin | Eliminar |
| POST | `/api/adoptions/:aid/adopt` | Sí | user | Adoptar |

### Productos (`/api/products`)

| Método | Ruta | Auth | Rol |
|---|---|---|---|
| GET | `/api/products` | No | - |
| GET | `/api/products/:pid` | No | - |
| POST | `/api/products` | Sí | admin |
| PUT | `/api/products/:pid` | Sí | admin |
| DELETE | `/api/products/:pid` | Sí | admin |

### Carritos (`/api/carts`)

Ver `src/routes/carts.router.js` para detalle.

## Docker

### Construir la imagen

```bash
docker build -t backend-ecommerce:1.0.0 .
```

### Levantar todo con Docker Compose (app + MongoDB)

```bash
# Editar .env con JWT_PRIVATE_KEY real
docker-compose up -d
docker logs -f backend-ecommerce
```

### Ejecutar solo la imagen (con MongoDB externo)

```bash
docker run -d --name backend-ecommerce \
  -p 8080:8080 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/ecommerce \
  -e JWT_PRIVATE_KEY=tu-clave-secreta-min-32-chars \
  backend-ecommerce:1.0.0
```

### Health check

```bash
curl http://localhost:8080/
```

## Decisiones técnicas del Dockerfile

- **`node:20-alpine`**: imagen base ligera (~120 MB vs 900 MB de Debian)
- **Multi-stage build**: separa compilación de runtime, descartando devDependencies
- **`npm install --omit=dev`**: instala solo dependencias de producción
- **`USER node`**: ejecuta como usuario no root (seguridad)
- **`HEALTHCHECK`**: `wget` al endpoint raíz cada 30 s con 3 reintentos
- **`NODE_ENV=production`**: optimiza el comportamiento de Express

## Seguridad

- JWT firmado con clave secreta de mínimo 32 caracteres
- Contraseñas hasheadas con `bcrypt`
- Variables de entorno para secretos (nunca en el repositorio)
- Middleware centralizado de errores que oculta stack en producción
- Roles diferenciados (`admin`, `user`)

## Comandos útiles

```bash
# Tests
npm test
npm run test:coverage

# Servidor
npm run dev
npm start

# Docker
docker build -t backend-ecommerce:1.0.0 .
docker-compose up -d
docker-compose down
docker logs -f backend-ecommerce
```

---

**Autor**: Miguel Zambrano - Comisión 76985 - CoderHouse Backend 2
