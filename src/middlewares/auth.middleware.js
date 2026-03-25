import { verifyToken, extractTokenFromHeader } from '../utils/jwt.js';

/**
 * Middleware para autenticar JWT
 */
export const authMiddleware = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        const token = extractTokenFromHeader(authorizationHeader);

        if (!token) {
            return res.status(401).json({ error: 'Token no proporcionado' });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ error: 'Token inválido o expirado' });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Error en autenticación', details: error.message });
    }
};

/**
 * Middleware para autorizar solo admins
 */
export const adminOnly = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Permisos insuficientes. Solo administradores' });
    }

    next();
};

/**
 * Middleware para autorizar solo usuarios
 */
export const userOnly = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    if (req.user.role !== 'user') {
        return res.status(403).json({ error: 'Permisos insuficientes. Solo usuarios' });
    }

    next();
};

/**
 * Middleware para autorizar admin o usuario propietario del recurso
 */
export const ownerOrAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const resourceOwnerId = req.params.id;
    const isOwner = req.user.userId === resourceOwnerId;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
        return res.status(403).json({ error: 'No tienes permisos para acceder a este recurso' });
    }

    next();
};

/**
 * Middleware sencillo para autorizar según rol (compatible con versión anterior)
 */
export const authorize = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ status: 'error', message: 'No autenticado' });
        }
        if (req.user.role !== requiredRole) {
            return res.status(403).json({ status: 'error', message: 'No autorizado' });
        }
        next();
    };
};
