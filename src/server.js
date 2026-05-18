import express from 'express';
import productsRouter from './routes/products.router.js';
import connectMongoDB from './config/db.js';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/error.midleware.js';
import cartRouter from './routes/carts.router.js';
import { engine } from 'express-handlebars';
import __dirname from '../dirname.js';
import viewsRouter from './routes/views.router.js';
import passport from './config/passport.config.js';
import usersRouter from './routes/users.router.js';
import sessionsRouter from './routes/sessions.router.js';
import { verifyMailerConnection } from './utils/mailer.js';

// Inicialización de variables de entorno
dotenv.config();

const app = express();
app.use(express.json()); // Middleware para parsear JSON
app.use(express.urlencoded({ extended: true })); // Middleware para parsear datos de formularios
app.use(express.static(__dirname + '/public')); // Middleware para servir archivos estáticos

// Inicializar Passport
app.use(passport.initialize());

const PORT = process.env.PORT || 8080;

// Conectar a MongoDB
connectMongoDB();

// Verificar conexión de email en startup
verifyMailerConnection();

// Configuración del motor de plantillas con helpers
app.engine('handlebars', engine({
    helpers: {
        multiply: (a, b) => a * b,
        gt: (a, b) => a > b,
        lt: (a, b) => a < b,
        eq: (a, b) => a === b,
        ne: (a, b) => a !== b,
        and: (a, b) => a && b,
        or: (a, b) => a || b
    }
}));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/src/views');

// Endpoints
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);
app.use('/api/users', usersRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/', viewsRouter);

// Manejo de errores (siempre al final)
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`✓ Servidor escuchando en puerto ${PORT}`);
    console.log(`✓ Base de datos conectada`);
    console.log(`✓ Aplicación lista para recibir solicitudes`);
});