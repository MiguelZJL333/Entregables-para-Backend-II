import express from 'express';
import {
    getAllAdoptions,
    getAdoptionById,
    createAdoption,
    updateAdoption,
    deleteAdoption,
    adoptAnimal
} from '../controllers/adoption.controller.js';
import { authMiddleware, adminOnly, userOnly } from '../middlewares/auth.middleware.js';

const adoptionRouter = express.Router();

// Listado público
adoptionRouter.get('/', getAllAdoptions);

// Detalle público
adoptionRouter.get('/:aid', getAdoptionById);

// Alta: solo admin
adoptionRouter.post('/', authMiddleware, adminOnly, createAdoption);

// Modificación: solo admin
adoptionRouter.put('/:aid', authMiddleware, adminOnly, updateAdoption);

// Eliminación: solo admin
adoptionRouter.delete('/:aid', authMiddleware, adminOnly, deleteAdoption);

// Adopción: usuario autenticado con rol user
adoptionRouter.post('/:aid/adopt', authMiddleware, userOnly, adoptAnimal);

export default adoptionRouter;
