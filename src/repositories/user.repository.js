import UserModel from '../models/user.model.js';

/**
 * Repository para operaciones de Usuario
 * Desacopla la lógica de datos del resto de la aplicación
 */
export class UserRepository {
    
    async findById(id) {
        return await UserModel.findById(id).populate('cart');
    }

    async findByEmail(email) {
        return await UserModel.findOne({ email: email.toLowerCase() });
    }

    async findAll(query = {}, options = {}) {
        return await UserModel.find(query, null, options).populate('cart');
    }

    async create(userData) {
        const user = new UserModel(userData);
        return await user.save();
    }

    async update(id, userData) {
        return await UserModel.findByIdAndUpdate(id, userData, { new: true }).populate('cart');
    }

    async delete(id) {
        return await UserModel.findByIdAndDelete(id);
    }

    async findByResetToken(token) {
        return await UserModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() }
        });
    }

    async updatePassword(id, hashedPassword) {
        return await UserModel.findByIdAndUpdate(
            id,
            {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null
            },
            { new: true }
        );
    }

    async updateResetToken(id, token, expiryDate) {
        return await UserModel.findByIdAndUpdate(
            id,
            {
                resetPasswordToken: token,
                resetPasswordExpires: expiryDate
            },
            { new: true }
        );
    }
}

export default new UserRepository();
