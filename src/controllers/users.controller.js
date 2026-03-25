import userService from '../services/user.service.js';
import { UserDTO, AuthUserDTO } from '../dtos/user.dto.js';

/**
 * Obtiene todos los usuarios (solo admin)
 */
export const getAllUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const users = await userService.getAllUsers({
            limit: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit)
        });

        res.status(200).json({
            status: 'success',
            payload: users.map(u => new UserDTO(u))
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Obtiene un usuario por ID
 */
export const getUserById = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const user = await userService.findUserById(uid);

        res.status(200).json({
            status: 'success',
            payload: new UserDTO(user)
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Obtiene el usuario actual autenticado
 */
export const getCurrentUser = async (req, res, next) => {
    try {
        const user = await userService.findUserById(req.user.userId);

        res.status(200).json({
            status: 'success',
            payload: new AuthUserDTO(user)
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Actualiza datos del usuario (el usuario propio o admin)
 */
export const updateUser = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const updateData = req.body;

        const updated = await userService.updateUser(uid, updateData);

        res.status(200).json({
            status: 'success',
            message: 'Usuario actualizado correctamente',
            payload: new UserDTO(updated)
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Elimina un usuario (solo admin)
 */
export const deleteUser = async (req, res, next) => {
    try {
        const { uid } = req.params;

        const deleted = await userService.deleteUser(uid);

        res.status(200).json({
            status: 'success',
            message: 'Usuario eliminado correctamente',
            payload: new UserDTO(deleted)
        });
    } catch (err) {
        next(err);
    }
};
