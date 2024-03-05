import mongoose from 'mongoose'
mongoose.models = {}
mongoose.modelSchemas = {}

const { Schema, model } = mongoose

const ticketSchema = Schema({
    code: { type: String, unique: true, required: true },

    purchase_datetime: { type: Date, default: Date.now },

    amount: { type: Number, required: true },

    purchaser: { type: String, required: true },
})

export const Ticket = model('Ticket', ticketSchema)
