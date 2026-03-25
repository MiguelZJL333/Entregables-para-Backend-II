import express from 'express';
import {
    getAllUsers,
    getUserById,
    getCurrentUser,
    updateUser,
    deleteUser
} from '../controllers/users.controller.js';
import { authMiddleware, adminOnly, ownerOrAdmin } from '../middlewares/auth.middleware.js';

const usersRouter = express.Router();

// Obtener usuario actual autenticado
usersRouter.get('/current/me', authMiddleware, getCurrentUser);

// Obtener todos los usuarios (solo admin)
usersRouter.get('/', authMiddleware, adminOnly, getAllUsers);

// Obtener un usuario por ID (admin o propietario)
usersRouter.get('/:uid', authMiddleware, ownerOrAdmin, getUserById);

// Actualizar usuario (admin o propietario)
usersRouter.put('/:uid', authMiddleware, ownerOrAdmin, updateUser);

// Eliminar usuario (solo admin)
usersRouter.delete('/:uid', authMiddleware, adminOnly, deleteUser);

export default usersRouter;
