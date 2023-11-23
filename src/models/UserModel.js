import mongoose from 'mongoose';
import bcrypt from 'bcrypt';


const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['usuario', 'admin'], default: 'usuario' },
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (candidatePassword) {

    // quise usar bcrypt para encrpitar pero siempre me devolvia false, lo dejo comentado porque planeo solucionarlo
    // console.log(await bcrypt.compare(candidatePassword, this.password), this.password)
    // return await bcrypt.compare(candidatePassword, this.password);
    if (candidatePassword=== this.password) {
        return true
    }
    return false
    };


export const User = mongoose.model('User', userSchema);
