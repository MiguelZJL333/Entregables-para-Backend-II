import express from 'express';
import passport from '../config/passport.config.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
    register,
    login,
    current,
    requestPasswordReset,
    resetPassword
} from '../controllers/sessions.controller.js';

const sessionsRouter = express.Router();

// Registro
sessionsRouter.post('/register', register);

// Login con passport local o JWT manual
sessionsRouter.post('/login', async (req, res, next) => {
    // Intentar autenticación con JWT en header
    const token = req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.slice(7)
        : null;

    if (token) {
        return authMiddleware(req, res, () => login(req, res, next));
    }

    // Si no hay token en header, usar passport local
    passport.authenticate('login', { session: false })(req, res, () => login(req, res, next));
});

// Obtener datos del usuario autenticado
sessionsRouter.get('/current', authMiddleware, current);

// Solicitar reset de contraseña
sessionsRouter.post('/forgot-password', requestPasswordReset);

// Reset de contraseña con token
sessionsRouter.post('/reset-password/:token', resetPassword);

export default sessionsRouter;
