import UserModel from '../models/user.model.js';
import CartModel from '../models/cart.model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { errorHandler } from '../util/httpErrors.js';

dotenv.config();

// Registrar un nuevo usuario y crearle un carrito
export const register = async (req, res, next) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        if (!first_name || !last_name || !email || !age || !password) {
            return errorHandler('Faltan datos obligatorios', 400);
        }

        const existing = await UserModel.findOne({ email });
        if (existing) return errorHandler('Email ya registrado', 400);

        const cart = await CartModel.create({});
        const user = await UserModel.create({
            first_name,
            last_name,
            email,
            age,
            password,
            cart: cart._id
        });

        res.status(201).json({ status: 'success', payload: user });
    } catch (err) {
        next(err);
    }
};

// Genera token para usuario autenticado (passport local ya puso user en req.user)
export const login = (req, res) => {
    const user = req.user;
    // omitimos campos sensibles
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'default_jwt_secret', {
        expiresIn: '1h'
    });

    res.json({ status: 'success', token });
};

// Devuelve la información del usuario que ya fue validado por la estrategia jwt
export const current = (req, res) => {
    res.json({ status: 'success', user: req.user });
};
