import {
  getAllCarts,
  createCart,
  getCart,
  deleteProductFromCart,
  updateCart,
  updateProductInCart,
  deleteCart,
} from '../../Persistencia/DAO/cartDAO.js';

// Función para obtener todos los carritos
export const getCarts = async (req, res) => {
  try {
    await getAllCarts(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Ocurrió un error al obtener los carritos.',
    });
  }
};

// Función para guardar un carrito
export const saveCart = async (req, res) => {
  try {
    await createCart(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Ocurrió un error al guardar el carrito.',
    });
  }
};

// Función para obtener un carrito específico
export const getSingleCart = async (req, res) => {
  try {
    await getCart(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Ocurrió un error al obtener el carrito.',
    });
  }
};

// Función para eliminar un producto del carrito
export const removeProductFromCart = async (req, res) => {
  try {
    await deleteProductFromCart(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Ocurrió un error al eliminar el producto del carrito.',
    });
  }
};

// Función para actualizar el carrito completo
export const updateWholeCart = async (req, res) => {
  try {
    await updateCart(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Ocurrió un error al actualizar el carrito.',
    });
  }
};

// Función para actualizar la cantidad de un producto en el carrito
export const updateProductQuantityInCart = async (req, res) => {
  try {
    await updateProductInCart(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Ocurrió un error al actualizar la cantidad del producto en el carrito.',
    });
  }
};

// Función para eliminar un carrito
export const removeCart = async (req, res) => {
  try {
    await deleteCart(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Ocurrió un error al eliminar todos los productos del carrito.',
    });
  }
};
