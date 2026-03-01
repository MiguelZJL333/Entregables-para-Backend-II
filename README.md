# Entrega Uno - Backend 2 (Comisión 76985)

Este proyecto es un ecommerce básico que ahora incluye un sistema completo de usuarios con autenticación y autorización. A continuación se explica cómo configurar y ejecutar el proyecto.

## 📦 Dependencias nuevas
Se agregaron las siguientes librerías a `package.json`:

- `bcrypt` → encriptar contraseñas
- `passport`, `passport-local`, `passport-jwt` → estrategias de autenticación
- `jsonwebtoken` → generar tokens JWT

> **No olvides** ejecutar:
> ```bash
> npm install bcrypt passport passport-local passport-jwt jsonwebtoken
> ```

## 🔐 Variables de entorno
Crear un archivo `.env` en la raíz con al menos estas variables:

```env
URL_MONGODB=mongodb://localhost/yourdb
JWT_SECRET=unalavariablesecreta
PORT=8080
```

## 🚀 Rutas principales
- **/api/users** → CRUD completo de usuarios
- **/api/sessions/register** → registra un usuario (genera carrito vacío)
- **/api/sessions/login** → autentica y devuelve JWT
- **/api/sessions/current** → valida el JWT y devuelve datos del usuario

## 🗂 Modelo de Usuario
El modelo `User` contiene los campos requeridos por la consigna:
`first_name, last_name, email(unique), age, password(hash), cart(reference), role(default "user")`.

Las contraseñas se encriptan automáticamente con un `pre('save')` de Mongoose.

## 📝 Notas
- La estrategia `passport-jwt` se usa como "current"; un token inválido produce un error de Passport.
- Para crear usuarios manualmente se puede usar `POST /api/users`.
- Se mantiene la funcionalidad anterior de productos, carritos y vistas.

¡Listo para entregar! Gracias por la revisión 😊 