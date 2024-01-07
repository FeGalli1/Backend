import mongoose from 'mongoose';
import { Cart } from './CartsModel.js';

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: { type: String, unique: true },
    age: Number,
    password: String,
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    role: { type: String, default: 'user' },
});

const User = mongoose.model('User', userSchema);

export default User;
