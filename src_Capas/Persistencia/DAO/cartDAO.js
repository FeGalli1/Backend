import { Cart } from '../models/CartsModel.js';

export const getAllCarts = async (req, res) => {
  const carts = await Cart.find().populate('products');
  res.status(200).json({
    status: 'success',
    payload: carts,
  });
};

export const createCart = async (req, res) => {
  const { product, quantity } = req.body;

  if (!product || !quantity || typeof quantity !== 'number' || quantity < 1) {
    return res.status(400).json({
      status: 'error',
      message: 'Los datos del carrito son inválidos.',
    });
  }

  const cart = new Cart({
    products: {
      product: product,
      quantity: quantity || 1,
    },
  });

  const cartSave = await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'Carrito guardado exitosamente.',
    cart: cartSave,
  });
};

export const getCart = async (req, res) => {
  const cart = await Cart.findById(req.params.cid).populate('products');
  if (!cart) {
    return res.status(404).json({
      status: 'error',
      message: 'Carrito no encontrado.',
    });
  }

  res.status(200).json({
    status: 'success',
    payload: cart,
  });
};

export const deleteProductFromCart = async (req, res) => {
  const cart = await Cart.findById(req.params.cid);
  if (!cart) {
    return res.status(404).json({
      status: 'error',
      message: 'Carrito no encontrado.',
    });
  }

  cart.products.pull({ _id: req.params.pid });
  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'Producto eliminado del carrito.',
  });
};

export const updateCart = async (req, res) => {
  const cart = await Cart.findById(req.params.cid);
  if (!cart) {
    return res.status(404).json({
      status: 'error',
      message: 'Carrito no encontrado.',
    });
  }

  cart.products = req.body.products;
  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'Carrito actualizado.',
  });
};

export const updateProductInCart = async (req, res) => {
  const cart = await Cart.findById(req.params.cid);
  if (!cart) {
    return res.status(404).json({
      status: 'error',
      message: 'Carrito no encontrado.',
    });
  }

  const productInCart = cart.products.id(req.params.pid);
  if (productInCart) {
    productInCart.quantity = req.body.quantity;
    await cart.save();
  }

  res.status(200).json({
    status: 'success',
    message: 'Cantidad del producto en el carrito actualizada.',
  });
};

export const deleteCart = async (req, res) => {
  const cart = await Cart.findById(req.params.cid);
  if (!cart) {
    return res.status(404).json({
      status: 'error',
      message: 'Carrito no encontrado.',
    });
  }

  cart.products = [];
  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'Todos los productos eliminados del carrito.',
  });
};
