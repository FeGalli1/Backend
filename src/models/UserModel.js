import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['usuario', 'admin'], default: 'usuario' },
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        console.error(error);
        return false;
    }
};

// Antes de guardar el usuario, hashea la contraseña si se modificó
userSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) {
            return next();
        }
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
        return next();
    } catch (error) {
        return next(error);
    }
});

export const User = mongoose.model('User', userSchema);
