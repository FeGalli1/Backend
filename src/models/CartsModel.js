'use strict'

import pkg from 'mongoose'
const { Schema, model } = pkg

const cartSchema = Schema({
    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product', // Referencia al modelo de Product
                required: true,
            },
            quantity: {
                type: Number,
                default: 1,
            },
        },
    ],
})

export const Cart = model('Cart', cartSchema)
