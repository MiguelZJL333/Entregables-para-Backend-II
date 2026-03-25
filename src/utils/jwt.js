import jwt from 'jsonwebtoken';

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY || 'tu_clave_secreta_super_segura_cambiar_en_produccion';

/**
 * Genera un JWT para autenticación
 */
export const generateToken = (userId, role = 'user') => {
    return jwt.sign(
        { userId, role },
        JWT_PRIVATE_KEY,
        { expiresIn: '24h' }
    );
};

/**
 * Verifica un JWT
 */
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_PRIVATE_KEY);
    } catch (error) {
        return null;
    }
};

/**
 * Genera un token para reseteo de contraseña (más corta duración)
 */
export const generateTokenEmail = (userId) => {
    return jwt.sign(
        { userId },
        JWT_PRIVATE_KEY,
        { expiresIn: '1h' }
    );
};

/**
 * Verifica un token de reseteo de contraseña
 */
export const verifyTokenEmail = (token) => {
    try {
        return jwt.verify(token, JWT_PRIVATE_KEY);
    } catch (error) {
        return null;
    }
};

/**
 * Extrae el token del header Authorization
 */
export const extractTokenFromHeader = (authorizationHeader) => {
    return authorizationHeader?.startsWith('Bearer ') 
        ? authorizationHeader.slice(7) 
        : null;
};
