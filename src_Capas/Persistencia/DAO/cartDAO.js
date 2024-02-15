import { Cart } from '../../persistencia/models/CartsModel.js';
import { Product } from '../models/ProductModel.js';
import { Ticket } from '../models/TicketsModel.js';
import User from '../models/UserModel.js';
import { logDebug, logError, logInfo } from '../../Errores/Winston.js';

const createError = (status, message) => ({ status, message });

export const getAllCarts = async () => {
  try {
    const carts = await Cart.find().populate('products');
    logInfo('Todos los carritos fueron obtenidos correctamente.');
    return carts;
  } catch (error) {
    throw logError(500, 'Error al obtener los carritos desde la base de datos.');
  }
};

export const createCart = async (product, quantity) => {
  try {
    if (!product || !quantity || typeof quantity !== 'number' || quantity < 1) {
      throw createError(400, 'Los datos del carrito son inválidos.');
    }
    logDebug("desde CartDAO crear product: ", product)
    const cart = new Cart();
    await cart.save();
    logInfo('Carrito creado correctamente.');
    return cart;
  } catch (error) {
    throw logError(500, 'Error al crear el carrito en la base de datos.');
  }
};

export const getCart = async (cartId) => {
  try {
    const cart = await Cart.findById(cartId).populate('products');
    if (!cart) {
      throw createError(404, 'Carrito no encontrado.');
    }
    logInfo('Carrito obtenido correctamente.');
    return cart;
  } catch (error) {
    throw logError(500, 'Error al obtener el carrito desde la base de datos.');
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
    logInfo(`Producto eliminado del carrito ${cartId} correctamente.`);
  } catch (error) {
    throw logError(500, 'Error al eliminar el producto del carrito en la base de datos.');
  }
};

export const updateCart = async (cartId, updatedProducts) => {
  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw createError(404, 'Carrito no encontrado.');
    }

    for (const productUpdate of updatedProducts) {
      const productId = productUpdate.id;
      const updatedQuantity = productUpdate.quantity;

      const productIndex = cart.products.findIndex(
        (product) => String(product.product) === productId
      );

      if (productIndex !== -1) {
        cart.products[productIndex].quantity = updatedQuantity;
      } else {
        cart.products.push({
          product: productId,
          quantity: updatedQuantity,
        });
      }
    }

    await cart.save();
    logInfo(`Carrito ${cartId} actualizado correctamente.`);
  } catch (error) {
    throw logError(500, 'Error al actualizar el carrito en la base de datos.');
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
      logInfo(`Cantidad del producto actualizada en el carrito ${cartId} correctamente.`);
    }
  } catch (error) {
    throw logError(500, 'Error al actualizar la cantidad del producto en el carrito.');
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
    logInfo(`Carrito ${cartId} eliminado correctamente.`);
  } catch (error) {
    throw logError(500, 'Error al eliminar el carrito en la base de datos.');
  }
};

export const purchase = async (cartId) => {
  try {
    const cart = await Cart.findById(cartId);

    if (!cart) {
      throw createError(404, 'Carrito no encontrado.');
    }

    const user = await User.findById(cart.owner);

    if (!user) {
      throw createError(404, 'Usuario no encontrado.');
    }

    const productsToPurchase = [];
    const productsNotPurchased = [];

    for (const cartProduct of cart.products) {
      const productId = cartProduct.product;

      if (!productId) {
        logError(cartProduct, cart);
        throw createError(404, 'ID del producto no encontrado en el carrito.');
      }

      const desiredQuantity = cartProduct.quantity;
      const product = await Product.findById(productId);

      if (!product) {
        throw createError(404, 'Producto no encontrado.');
      }

      if (product.stock >= desiredQuantity) {
        product.stock -= parseInt(desiredQuantity);
        productsToPurchase.push({ product, quantity: desiredQuantity });
        await product.save();
      } else {
        productsNotPurchased.push({ productId: product._id, quantity: desiredQuantity });
      }
    }

    cart.products = productsNotPurchased;
    await cart.save();
    
    if(!productsNotPurchased) {
      throw createError(404, 'Ningun producto tenia stock.');
    }
    
    const code = await generateUniqueCode(); 

    const ticket = new Ticket({
      code: code,
      amount: calculateTotalAmount(productsToPurchase),
      purchaser: user.email,
    });

    await ticket.save();
    const email = `
      <div style="max-width: 960px; margin: 0 auto;">
          <div style="border: 1px solid #dee2e6; background-color: #fff; padding: 1.5rem; margin-top: 1rem;">
              <h1 style="text-align: center; margin-bottom: 4rem;">Detalles del Ticket</h1>
          
              <p style="margin-bottom: 2rem;">Número de Ticket: ${ticket.code}</p>
              <p style="margin-bottom: 2rem;">Monto Total: $ ${ticket.amount}</p>
              <p style="margin-bottom: 4rem;">Mail de Facturación: ${ticket.purchaser}</p>
      
              <div style="text-align: center;">
                  <a href="/api/carts/ticket/${ticket.code}" style="display: inline-block; padding: 0.5rem 1rem; border: 1px solid #007bff; background-color: #007bff; color: #fff; text-decoration: none; font-size: 1rem; cursor: pointer;">Ver Compra</a>
              </div>
          </div>
      </div>
    `
    sendGmail(user.email, "Procesando Compra", email);

    logInfo('Compra realizada correctamente.');
    return { success: true, ticket, productsNotPurchased };
  } catch (error) {
    logError(error);
    throw logError(500, 'Error al procesar la compra.');
  }
};
