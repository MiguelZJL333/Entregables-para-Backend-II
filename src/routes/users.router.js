import express from 'express';
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from '../controllers/users.controller.js';

const usersRouter = express.Router();

usersRouter.get('/', getAllUsers);
usersRouter.get('/:uid', getUserById);
usersRouter.post('/', createUser);
usersRouter.put('/:uid', updateUser);
usersRouter.delete('/:uid', deleteUser);

export default usersRouter;
