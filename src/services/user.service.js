import userRepository from '../repositories/user.repository.js';
import cartRepository from '../repositories/cart.repository.js';
import { generateTokenEmail, verifyTokenEmail } from '../utils/jwt.js';
import { sendPasswordResetEmail } from '../utils/mailer.js';
import bcrypt from 'bcrypt';

/**
 * Service para lógica de negocio de Usuarios
 */
export class UserService {

    async registerUser(userData) {
        const existingUser = await userRepository.findByEmail(userData.email);
        if (existingUser) throw new Error('El email ya está registrado');

        // Crear carrito para el nuevo usuario
        const newCart = await cartRepository.create();

        const userToCreate = {
            ...userData,
            cart: newCart._id
        };

        return await userRepository.create(userToCreate);
    }

    async findUserById(id) {
        const user = await userRepository.findById(id);
        if (!user) throw new Error('Usuario no encontrado');
        return user;
    }

    async findUserByEmail(email) {
        return await userRepository.findByEmail(email);
    }

    async validatePassword(email, password) {
        const user = await this.findUserByEmail(email);
        if (!user) throw new Error('Usuario no encontrado');

        if (!user.isValidPassword(password)) {
            throw new Error('Contraseña incorrecta');
        }

        return user;
    }

    async requestPasswordReset(email) {
        const user = await this.findUserByEmail(email);
        if (!user) throw new Error('Usuario no encontrado');

        // Generar token que expira en 1 hora
        const resetToken = generateTokenEmail(user._id.toString());
        const expiryDate = new Date(Date.now() + 3600000); // 1 hora

        await userRepository.updateResetToken(user._id, resetToken, expiryDate);

        // Enviar email
        const resetLink = `http://localhost:8080/reset-password/${resetToken}`;
        await sendPasswordResetEmail(email, resetLink, user.first_name);

        return { message: 'Email de recuperación enviado' };
    }

    async resetPassword(token, newPassword) {
        // Verificar token
        const decoded = verifyTokenEmail(token);
        if (!decoded) throw new Error('Token inválido o expirado');

        // Encontrar usuario por token
        const user = await userRepository.findByResetToken(token);
        if (!user) throw new Error('Token inválido o expirado');

        // Verificar que la nueva contraseña no sea igual a la anterior
        if (user.isValidPassword(newPassword)) {
            throw new Error('La nueva contraseña no puede ser igual a la anterior');
        }

        // Hash de la nueva contraseña
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(newPassword, salt);

        // Actualizar contraseña
        return await userRepository.updatePassword(user._id, hashedPassword);
    }

    async getAllUsers(options = {}) {
        return await userRepository.findAll({}, options);
    }

    async updateUser(id, updateData) {
        // No permitir actualización de email o rol a través de este método
        const { email, role, password, ...safeData } = updateData;
        
        return await userRepository.update(id, safeData);
    }

    async deleteUser(id) {
        const user = await this.findUserById(id);
        
        // Eliminar carrito asociado
        if (user.cart) {
            await cartRepository.delete(user.cart);
        }

        return await userRepository.delete(id);
    }
}

export default new UserService();
