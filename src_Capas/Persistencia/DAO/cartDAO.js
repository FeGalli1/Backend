//aunque esta mal desarrollada ../../persistencia porque salgo y veuelvo a entrar, es por problemas con la mayuscula
import { calculateTotalAmount, generateUniqueCode } from '../../Controles/utils/helpers.js';
import { Cart } from '../../persistencia/models/CartsModel.js';
import { Product } from '../models/ProductModel.js';
import { Ticket } from '../models/TicketsModel.js';
import User from '../models/UserModel.js';
import ProductRepository from './ProductRepository.js';

const createError = (status, message) => ({ status, message });

export const getAllCarts = async () => {
  try {
    return await Cart.find().populate('products');
  } catch (error) {
    throw createError(500, 'Error al obtener los carritos desde la base de datos.');
  }
};

export const createCart = async (product, quantity) => {
  try {
    if (!product || !quantity || typeof quantity !== 'number' || quantity < 1) {
      throw createError(400, 'Los datos del carrito son inválidos.');
    }
    console.log("desde CartDAO crear product: ", product)
    const cart = new Cart();

    return await cart.save();
  } catch (error) {
    throw createError(500, 'Error al crear el carrito en la base de datos.');
  }
};

export const getCart = async (cartId) => {
  try {
    return await Cart.findById(cartId).populate('products');
  } catch (error) {
    throw createError(500, 'Error al obtener el carrito desde la base de datos.');
  }
};

export const deleteProductFromCart = async (cartId, productId) => {
  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw createError(404, 'Carrito no encontrado.');
    }

    cart.products.pull({ _id: productId });
    await cart.save();
  } catch (error) {
    throw createError(500, 'Error al eliminar el producto del carrito en la base de datos.');
  }
};

export const updateCart = async (cartId, updatedProducts) => {
  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw createError(404, 'Carrito no encontrado.');
    }

    // Iterar sobre los productos actualizados
    for (const productUpdate of updatedProducts) {
      const productId = productUpdate.id;
      const updatedQuantity = productUpdate.quantity;

      // Buscar el índice del producto en el carrito
      const productIndex = cart.products.findIndex(
        (product) => String(product.product) === productId
      );

      // Si el producto está en el carrito, actualizar la cantidad
      if (productIndex !== -1) {
        cart.products[productIndex].quantity = updatedQuantity;
      } else {
        // Si el producto no está en el carrito, agregarlo
        cart.products.push({
          product: productId,
          quantity: updatedQuantity,
        });
      }
    }

    // Guardar el carrito actualizado
    await cart.save();
  } catch (error) {
    throw createError(500, 'Error al actualizar el carrito en la base de datos.');
  }
};


export const updateProductInCart = async (cartId, productId, updatedQuantity) => {
  try { 
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw createError(404, 'Carrito no encontrado.');
    }

    const productInCart = cart.products.id(productId);
    if (productInCart) {
      productInCart.quantity = updatedQuantity;
      await cart.save();
    }
  } catch (error) {
    throw createError(500, 'Error al actualizar la cantidad del producto en el carrito.');
  }
};

export const deleteCart = async (cartId) => {
  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw createError(404, 'Carrito no encontrado.');
    }

    cart.products = [];
    await cart.save();
  } catch (error) {
    throw createError(500, 'Error al eliminar el carrito en la base de datos.');
  }
};


export const purchase = async (cartId) => {
  try {
    // Obtener el carrito y los productos asociados
    const cart = await Cart.findById(cartId);

    // Validar si el carrito existe
    if (!cart) {
      return { error: 'Carrito no encontrado.' };
    }

    // Obtener el usuario asociado al carrito
    const user = await User.findById(cart.owner);

    // Validar si el usuario existe
    if (!user) {
      return { error: 'Usuario no encontrado.' };
    }

    // Inicializar arrays para productos comprados y no comprados
    const productsToPurchase = [];
    const productsNotPurchased = [];

    // Verificar y procesar cada producto en el carrito
    for (const cartProduct of cart.products) {
      const productId = cartProduct.product;

      // Validar si el productId existe
      if (!productId) {
        console.error(cartProduct, cart);
        return { error: 'ID del producto no encontrado en el carrito.' };
      }

      const desiredQuantity = cartProduct.quantity;
      console.log(productId, ' products ', desiredQuantity, ' producto ');
      const product = await Product.findById(productId);

      // Validar si el producto existe
      if (!product) {
        return { error: 'Producto no encontrado.' };
      }

      // Verificar disponibilidad de stock
      if (product.stock >= desiredQuantity) {
        // Restar del stock y agregar al array de productos comprados
        product.stock -= desiredQuantity;
        productsToPurchase.push({ product, quantity: desiredQuantity });
        console.log("Tiene stock")
      } else {
        console.log("No Tiene stock")

        // Agregar al array de productos no comprados
        productsNotPurchased.push({ productId: product._id, quantity: desiredQuantity });
      }
    }

    // Actualizar el carrito con productos no comprados
    cart.products = productsNotPurchased;
    console.log(productsNotPurchased,cart)
    // Guardar el carrito actualizado
    await cart.save();
    const code = await generateUniqueCode(); 
    // Crear un ticket con los productos comprados
    const ticket = new Ticket({
      code: code, // Implementa esta función
      amount: calculateTotalAmount(productsToPurchase),
      purchaser: user.email, // Usa el correo electrónico del usuario
    });

    // Guardar el ticket en la base de datos
    await ticket.save();

    return { success: true, ticket, productsNotPurchased };
  } catch (error) {
    console.error(error);
    return { error: 'Error al procesar la compra.' };
  }
};