#!/usr/bin/env node

/**
 * Script para crear un usuario Admin inicial
 * Uso: node scripts/create-admin.js
 */

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import UserModel from '../src/models/user.model.js';
import CartModel from '../src/models/cart.model.js';

dotenv.config();

const createAdmin = async () => {
    try {
        // Conectar a MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
        console.log('✓ Conectado a MongoDB');

        // Datos del admin
        const adminData = {
            first_name: 'Admin',
            last_name: 'Usuario',
            email: process.env.ADMIN_EMAIL || 'admin@example.com',
            age: 30,
            password: process.env.ADMIN_PASSWORD || 'Admin123!@#',
            role: 'admin'
        };

        // Verificar si admin ya existe
        const existingAdmin = await UserModel.findOne({ email: adminData.email });
        if (existingAdmin) {
            console.log('⚠️  Admin con este email ya existe');
            process.exit(0);
        }

        // Crear carrito para el admin
        const cart = await CartModel.create({});
        console.log('✓ Carrito creado');

        // Crear usuario admin
        const admin = await UserModel.create({
            ...adminData,
            cart: cart._id
        });

        console.log('✅ Usuario admin creado exitosamente');
        console.log('');
        console.log('📧 Email:', adminData.email);
        console.log('🔐 Contraseña:', adminData.password);
        console.log('👤 Role:', admin.role);
        console.log('🆔 Admin ID:', admin._id);
        console.log('');
        console.log('⚠️  IMPORTANTE: Cambiar la contraseña después de login inicial');
        console.log('⚠️  USAR variables de entorno en producción (ADMIN_EMAIL, ADMIN_PASSWORD)');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error al crear admin:', error.message);
        process.exit(1);
    }
};

createAdmin();
