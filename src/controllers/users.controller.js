import UserModel from '../models/user.model.js';
import { errorHandler } from '../util/httpErrors.js';

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await UserModel.find().lean();
        res.status(200).json({ status: 'success', payload: users });
    } catch (err) {
        next(err);
    }
};

export const getUserById = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const user = await UserModel.findById(uid).lean();
        if (!user) errorHandler('Usuario no encontrado', 404);
        res.status(200).json({ status: 'success', payload: user });
    } catch (err) {
        next(err);
    }
};

export const createUser = async (req, res, next) => {
    try {
        const { email } = req.body;
        const existing = await UserModel.findOne({ email });
        if (existing) return errorHandler('Email ya registrado', 400);

        const user = await UserModel.create(req.body); // password is hashed via pre-save
        res.status(201).json({ status: 'success', payload: user });
    } catch (err) {
        next(err);
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const data = req.body;
        // if password is included we might need to hash it manually or rely on save hook;
        if (data.password) {
            // manual hashing so findByIdAndUpdate does not trigger pre('save')
            const bcrypt = await import('bcrypt');
            const salt = bcrypt.genSaltSync(10);
            data.password = bcrypt.hashSync(data.password, salt);
        }
        const updated = await UserModel.findByIdAndUpdate(uid, data, { new: true, runValidators: true });
        if (!updated) errorHandler('Usuario no encontrado', 404);
        res.status(200).json({ status: 'success', payload: updated });
    } catch (err) {
        next(err);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const deleted = await UserModel.findByIdAndDelete(uid);
        if (!deleted) errorHandler('Usuario no encontrado', 404);
        res.status(200).json({ status: 'success', payload: deleted });
    } catch (err) {
        next(err);
    }
};
