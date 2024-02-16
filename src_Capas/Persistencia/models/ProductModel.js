'use strict'

import pkg from 'mongoose'
const { Schema, model } = pkg

const productSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['computers', 'phones', 'accesories'],
    },
    description: {
        type: String,
        required: true,
    },   
    stock: { type: Number, default: 0 },
    owner: { type: String, 
            default: 'admin' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

export const Product = model('Product', productSchema)
