import mongoose from 'mongoose'

const documentSchema = new mongoose.Schema({
    name: { type: String },
    content: { type: Buffer }, // Almacenar el contenido del documento como un Buffer en la base de datos
})

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: { type: String, unique: true },
    age: Number,
    password: String,
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    role: { type: String, default: 'user' },
    // Array de documentos utilizando el esquema de documento
    documents: [documentSchema],
    last_connection: { type: Date },
    resetToken: String,
    resetTokenExpiration: Date,
})

const User = mongoose.model('User', userSchema)

export default User
