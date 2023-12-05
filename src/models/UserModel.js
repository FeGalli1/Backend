'use strict';
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

userSchema.methods.create1 = async function (email,password) {
    console.log("entre a create1")
        // Crea un nuevo usuario
        const newUser = new User({ email, role: 'usuario' });

        // Genera el hash de la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Almacena la contraseña con hash en el usuario
        newUser.password = hashedPassword;

        // Guarda el usuario en la base de datos
        await newUser.save();

        // Crea una sesión y almacena el ID del usuario
        req.session.userId = newUser._id;

        // Redirecciona a la vista de productos después del registro
        res.redirect('/products');
    }
export const User = mongoose.model('User', userSchema);
