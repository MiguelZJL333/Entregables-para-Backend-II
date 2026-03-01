import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
    {
        first_name: {
            type: String,
            required: true,
            trim: true
        },
        last_name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        age: {
            type: Number,
            required: true,
            min: 0
        },
        password: {
            type: String,
            required: true,
        },
        cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'carts'
        },
        role: {
            type: String,
            default: 'user'
        }
    },
    { timestamps: true }
);

// Encriptar la contraseña antes de guardar si fue modificada
userSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next();
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
    next();
});

// Método para comparar contraseña
userSchema.methods.isValidPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

const UserModel = mongoose.model('users', userSchema);
export default UserModel;
