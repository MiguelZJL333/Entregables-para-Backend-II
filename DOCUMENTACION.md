# Ecommerce API - Backend Profesional

## 📋 Descripción

Backend de ecommerce construido con Node.js, Express y MongoDB, implementando una **arquitectura en capas** profesional con patrones de diseño avanzados, seguridad basada en JWT, autenticación y autorización por roles.

## 🏗️ Arquitectura

```
src/
├── controllers/      # Controladores (manejo de requests)
├── services/         # Servicios (lógica de negocio)
├── repositories/     # Repositorios (acceso a datos)
├── models/          # Modelos Mongoose
├── dtos/            # Data Transfer Objects
├── middlewares/     # Middlewares de autenticación/autorización
├── routes/          # Definición de rutas
├── config/          # Configuraciones
├── util/            # Utilidades
└── public/          # Archivos estáticos
```

## 🔧 Instalación

1. **Clonar el repositorio**
```bash
git clone <tu-repo>
cd Entregable_Zambrano_Miguel_76985
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Crear archivo `.env` basado en `.env.example`:
```bash
cp .env.example .env
```

Actualizar con tus credenciales:
```env
MONGODB_URI=tu_conexion_mongodb
JWT_PRIVATE_KEY=tu_clave_secreta_muy_larga_y_segura
MAIL_USER=tu_email@gmail.com
MAIL_PASSWORD=tu_app_password
```

4. **Iniciar la aplicación**
```bash
npm run dev    # Modo desarrollo (nodemon)
npm start      # Modo producción
```

## 🔐 Seguridad y Autenticación

### JWT (JSON Web Tokens)
- Token con duración de 24 horas
- Enviado en header: `Authorization: Bearer <token>`
- Generado al login

### Roles y Permisos

#### `admin`
- ✅ Crear productos
- ✅ Actualizar productos
- ✅ Eliminar productos
- ✅ Ver todos los usuarios
- ✅ Ver tickets

#### `user`
- ✅ Ver productos
- ✅ Agregar al carrito
- ✅ Realizar compra
- ✅ Ver tickets propios

## 📚 Endpoints Principales

### Autenticación

#### POST `/api/sessions/register`
Registrar nuevo usuario
```json
{
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan@example.com",
  "age": 25,
  "password": "contraseña123"
}
```

#### POST `/api/sessions/login`
Iniciar sesión
```json
{
  "email": "juan@example.com",
  "password": "contraseña123"
}
```
Respuesta:
```json
{
  "status": "success",
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "first_name": "Juan",
    "email": "juan@example.com",
    "role": "user"
  }
}
```

#### GET `/api/sessions/current`
Obtener usuario actual (requiere JWT)
```bash
curl -H "Authorization: Bearer <token>" http://localhost:8080/api/sessions/current
```

### Recuperación de Contraseña

#### POST `/api/sessions/forgot-password`
Solicitar recuperación de contraseña
```json
{
  "email": "usuario@example.com"
}
```

#### POST `/api/sessions/reset-password/:token`
Establecer nueva contraseña (token en URL)
```json
{
  "newPassword": "nuevaContraseña123",
  "confirmPassword": "nuevaContraseña123"
}
```

### Productos

#### GET `/api/products`
Obtener todos los productos con paginación
```
?page=1&limit=10&sort=-1
```

#### GET `/api/products/:pid`
Obtener un producto por ID

#### POST `/api/products` ✅ Admin
Crear nuevo producto
```json
{
  "title": "Laptop",
  "description": "Laptop de última generación",
  "code": "LAP001",
  "price": 1200,
  "stock": 10,
  "category": "Electronicos"
}
```

#### PUT `/api/products/:pid` ✅ Admin
Actualizar producto

#### DELETE `/api/products/:pid` ✅ Admin
Eliminar producto

### Carrito

#### GET `/api/carts/:cartId`
Obtener carrito

#### POST `/api/carts/:cartId/product` ✅ User
Agregar producto al carrito
```json
{
  "productId": "...",
  "quantity": 2
}
```

#### PUT `/api/carts/:cartId/product/:productId` ✅ User
Actualizar cantidad de producto
```json
{
  "quantity": 5
}
```

#### DELETE `/api/carts/:cartId/product/:productId` ✅ User
Eliminar producto del carrito

#### DELETE `/api/carts/:cartId` ✅ User
Vaciar carrito

#### POST `/api/carts/:cartId/purchase` ✅ User
Procesar compra (genera ticket)

Respuesta exitosa:
```json
{
  "status": "success",
  "message": "Compra procesada exitosamente",
  "payload": {
    "ticket": "...",
    "code": "TICK-1234567890-ABC123",
    "amount": 2400,
    "products": 2,
    "failedProducts": 0,
    "status": "completed"
  }
}
```

#### GET `/api/carts/ticket/:ticketId`
Obtener detalles de un ticket

### Usuarios

#### GET `/api/users/current/me` ✅ Autenticado
Obtener datos del usuario actual

#### GET `/api/users` ✅ Admin
Obtener todos los usuarios

#### GET `/api/users/:uid` ✅ Admin o Propietario
Obtener usuario específico

#### PUT `/api/users/:uid` ✅ Admin o Propietario
Actualizar usuario

#### DELETE `/api/users/:uid` ✅ Admin
Eliminar usuario

## 💼 Lógica de Negocio

### Compra de Productos

1. **Validación de Stock**
   - Se verifica disponibilidad antes de procesar
   - Permite compras parciales (productos con stock insuficiente)

2. **Generación de Ticket**
   - Código único: `TICK-{timestamp}-{random}`
   - Incluye: productos comprados, precio total, fecha
   - Estado: `completed` o `partial`

3. **Actualización de Stock**
   - Se reduce automáticamente al completar compra
   - Solo para productos con stock disponible

4. **Email Confirmación**
   - Se envía confirmación automática al email del usuario
   - Incluye detalles de la compra

### Recuperación de Contraseña

1. Usuario solicita reset con email
2. Se genera token JWT válido por 1 hora
3. Se envía enlace `http://localhost:8080/reset-password/{token}`
4. Usuario establece nueva contraseña
5. Validaciones:
   - Nueva contraseña ≠ anterior contraseña
   - Hashing seguro con bcrypt
   - Token expira después de 1 hora

## 📦 DTOs (Data Transfer Objects)

Los DTOs controlan qué información se expone:

**UserDTO**: Excluye contraseña y tokens de reset
**AuthUserDTO**: Solo información pública del autenticado
**ProductDTO**: Información del producto sin metadatos internos

## 🛡️ Manejo de Errores

Respuesta de error centralizada:
```json
{
  "status": "error",
  "message": "Descripción del error",
  "details": "Detalles adicionales (en desarrollo)"
}
```

Códigos HTTP:
- 400: Bad Request (validación)
- 401: Unauthorized (sin autenticación)
- 403: Forbidden (sin permisos)
- 404: Not Found (recurso no encontrado)
- 409: Conflict (duplicado)
- 500: Internal Server Error

## 📧 Configuración de Email

### Con Gmail App Password

1. Habilitar 2FA en tu cuenta Google
2. Generar [App Password](https://myaccount.google.com/apppasswords)
3. Usar la contraseña generada en `MAIL_PASSWORD`

### Otras opciones
Modificar `MAIL_SERVICE` en `.env` para usar otros proveedores (outlook, yahoo, etc.)

## 🧪 Pruebas Recomendadas

Usar Postman o similar:

```bash
# Registro
POST http://localhost:8080/api/sessions/register

# Login
POST http://localhost:8080/api/sessions/login

# Obtener productos
GET http://localhost:8080/api/products

# Con JWT en header
GET http://localhost:8080/api/sessions/current
Authorization: Bearer <token_aqui>
```

## 📝 Notas Importantes

1. **Node Modules**: No incluir en Git (está en .gitignore)
2. **.env**: No subir a Git (usar .env.example)
3. **Contraseñas**: Siempre usar hashing con bcrypt
4. **JWT_PRIVATE_KEY**: Cambiar en producción a algo más largo y seguro
5. **CORS**: Configurar según necesidades de frontend

## 🚀 Próximas Mejoras

- [ ] Refresh tokens
- [ ] Rate limiting
- [ ] Tests unitarios
- [ ] Documentación Swagger
- [ ] Caché con Redis
- [ ] Transacciones ACID
- [ ] Logs estructurados

## 👤 Autor

Miguel Zambrano - CoderHouse Backend 2024

## 📄 Licencia

ISC
