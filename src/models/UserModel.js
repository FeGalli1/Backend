'use strict';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: String,
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


export const User = mongoose.model('User', userSchema);
