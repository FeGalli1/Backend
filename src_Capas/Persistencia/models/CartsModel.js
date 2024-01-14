import mongoose from 'mongoose';
// Limpiar la caché de Mongoose
mongoose.models = {};
mongoose.modelSchemas = {};

const { Schema, model } = mongoose;

const cartSchema = Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Cart = model('Cart', cartSchema);
