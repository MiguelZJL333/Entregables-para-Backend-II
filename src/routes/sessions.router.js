import express from 'express';
import passport from '../config/passport.config.js';
import {
    register,
    login,
    current
} from '../controllers/sessions.controller.js';

const sessionsRouter = express.Router();

// registro
sessionsRouter.post('/register', register);

// login con passport local
sessionsRouter.post('/login', passport.authenticate('login', { session: false }), login);

// ruta para obtener datos del usuario autenticado a partir del JWT
sessionsRouter.get('/current', passport.authenticate('jwt', { session: false }), current);

export default sessionsRouter;
