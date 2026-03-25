import userService from '../services/user.service.js';
import { generateToken } from '../utils/jwt.js';
import { AuthUserDTO } from '../dtos/user.dto.js';

/**
 * Registra un nuevo usuario
 */
export const register = async (req, res, next) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        // Validaciones básicas
        if (!first_name || !last_name || !email || !age || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Faltan datos obligatorios'
            });
        }

        const user = await userService.registerUser({
            first_name,
            last_name,
            email,
            age,
            password
        });

        res.status(201).json({
            status: 'success',
            message: 'Usuario registrado correctamente',
            payload: new AuthUserDTO(user)
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Autentica un usuario y genera JWT
 */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Email y contraseña requeridos'
            });
        }

        const user = await userService.validatePassword(email, password);
        
        const token = generateToken(user._id.toString(), user.role);

        res.json({
            status: 'success',
            token,
            user: new AuthUserDTO(user)
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Obtiene la información del usuario autenticado
 * Requiere middleware de autenticación JWT
 */
export const current = async (req, res, next) => {
    try {
        const user = await userService.findUserById(req.user.userId);
        
        res.json({
            status: 'success',
            payload: new AuthUserDTO(user)
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Solicita reset de contraseña
 */
export const requestPasswordReset = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                status: 'error',
                message: 'Email requerido'
            });
        }

        const result = await userService.requestPasswordReset(email);

        res.json({
            status: 'success',
            message: result.message
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Reset de contraseña con token
 */
export const resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { newPassword, confirmPassword } = req.body;

        if (!newPassword || !confirmPassword) {
            return res.status(400).json({
                status: 'error',
                message: 'Contraseña y confirmación requeridas'
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                status: 'error',
                message: 'Las contraseñas no coinciden'
            });
        }

        const user = await userService.resetPassword(token, newPassword);

        res.json({
            status: 'success',
            message: 'Contraseña actualizada correctamente',
            payload: new AuthUserDTO(user)
        });
    } catch (error) {
        next(error);
    }
};
