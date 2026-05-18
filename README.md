# Backend E-commerce - Entregable Final

## Descripcion del Proyecto

API REST completa para una aplicacion de comercio electronico desarrollada con Node.js, Express y MongoDB. Este proyecto incluye funcionalidades de gestion de productos, carritos de compras, procesamiento de compras y sistema de autenticacion con JWT.

## Estructura del Proyecto

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
├── .dockerignore         # Archivos excluidos del build
├── package.json          # Dependencias y scripts
└── README.md             # Este archivo
```

## Tecnologias Utilizadas

- **Runtime**: Node.js 20 (Alpine)
- **Framework**: Express 5.x
- **Base de datos**: MongoDB con Mongoose
- **Autenticacion**: JWT + Passport
- **Testing**: Jest + Supertest + MongoDB Memory Server
- **Docker**: Multi-stage build optimizado

## Requisitos Previos

- Node.js 18+ (para desarrollo local)
- Docker (para containerizacion)
- MongoDB (local o Atlas)
- npm o yarn

## Instalacion

```bash
# Clonar el repositorio
git clone https://github.com/miguelzambrano/Entregable_Zambrano_Miguel_76985.git
cd Entregable_Zambrano_Miguel_76985

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales
```

## Variables de Entorno

Crear archivo `.env` con:

```env
PORT=8080
URL_MONGODB=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-secret-key-min-32-chars
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

## Ejecutar Tests Funcionales

```bash
# Ejecutar todos los tests
npm test

# Ejecutar con cobertura
npm run test:coverage
```

Los tests funcionales cubren:
- **Products Router**: GET, POST, PUT, DELETE endpoints
- **Carts Router**: GET, POST, PUT, DELETE endpoints
- **Casos de borde**: IDs invalidos, autenticacion, permisos

## Ejecutar la Aplicacion

```bash
# Modo desarrollo (con hot-reload)
npm run dev

# Modo produccion
npm start
```

## Dockerizacion

### Construir Imagen

```bash
# Construir imagen localmente
docker build -t backend-ecommerce:1.0.0 .

# O usar el script automatizado
chmod +x scripts/build-docker.sh
./scripts/build-docker.sh
```

### Ejecutar Contenedor

```bash
# Ejecutar con variables de entorno
docker run -d -p 8080:8080 \
  -e URL_MONGODB=mongodb://host.docker.internal:27017/ecommerce \
  -e JWT_SECRET=your-secret \
  --name backend-ecommerce \
  backend-ecommerce:1.0.0

# Ver logs
docker logs -f backend-ecommerce

# Detener contenedor
docker stop backend-ecommerce
```

### Docker Compose (Opcional)

```yaml
version: '3.8'
services:
  app:
    image: miguelzambrano/backend-ecommerce:1.0.0
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
      - URL_MONGODB=mongodb://mongo:27017/ecommerce
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongo
  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
```

## Endpoints de la API

### Productos
- `GET /api/products` - Listar productos (paginado)
- `GET /api/products/:pid` - Obtener producto por ID
- `POST /api/products` - Crear producto (admin)
- `PUT /api/products/:pid` - Actualizar producto (admin)
- `DELETE /api/products/:pid` - Eliminar producto (admin)

### Carritos
- `GET /api/carts/:cartId` - Obtener carrito
- `POST /api/carts/:cartId/product` - Agregar producto
- `PUT /api/carts/:cartId/product/:productId` - Actualizar cantidad
- `DELETE /api/carts/:cartId/product/:productId` - Eliminar producto
- `DELETE /api/carts/:cartId` - Vaciar carrito
- `POST /api/carts/:cartId/purchase` - Procesar compra

### Autenticacion
- `POST /api/sessions/register` - Registro de usuario
- `POST /api/sessions/login` - Iniciar sesion
- `GET /api/sessions/current` - Usuario actual

## Documentacion API (Swagger)

La documentacion interactiva esta disponible en:
```
http://localhost:8080/api-docs
```

## Informacion del Contenedor Docker

**Imagen DockerHub**: `miguelzambrano/backend-ecommerce:1.0.0`

**URL Publica**: https://hub.docker.com/r/miguelzambrano/backend-ecommerce

### Optimizaciones del Dockerfile

1. **Multi-stage build**: Reduce tamano final de imagen
2. **Imagen base Alpine**: Minimiza espacio (~120MB vs ~900MB)
3. **Usuario no root**: Mejora seguridad
4. **Cache de dependencias**: Solo se rebuild cuando package.json cambia
5. **Healthcheck integrado**: Monitoreo de disponibilidad
6. **Limpieza de npm cache**: Reduce tamano final

## Seguridad

- Autenticacion JWT obligatoria para rutas protegidas
- Contrasenas encriptadas con bcrypt
- Validacion de entrada en todos los endpoints
- Rate limiting recomendado para produccion
- Variables de entorno para secretos

## Tests - Evidencia de Ejecucion

Los tests funcionales validan:
- 34 tests passing (17 products + 17 carts)
- Cobertura de endpoints publicos y protegidos
- Manejo de errores y validaciones
- Aislamiento con MongoDB Memory Server

```
PASS src/test/carts.test.js
PASS src/test/products.test.js
Test Suites: 2 passed, 2 total
Tests:       34 passed, 34 total
```

## Contribuir

1. Fork el repositorio
2. Crear branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## Licencia

ISC

## Autor

Miguel Zambrano - Comision 76985 - CoderHouse Backend 2