import CartRepository from '../../Persistencia/DAO/CartRepository.js';

const cartRepository =  CartRepository;

export const getCarts = async (req, res) => {
  try {
    const carts = await cartRepository.getAllCarts();
    res.status(200).json({
      status: 'success',
      payload: carts,
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      status: 'error',
      message: error.message || 'Ocurrió un error al obtener los carritos.',
    });
  }
};

export const saveCart = async (req, res) => {
  try {
    const { product, quantity } = req.body;
    const newCart = await cartRepository.createCart(product, quantity);
    res.status(200).json({
      status: 'success',
      message: 'Carrito guardado exitosamente.',
      cart: newCart,
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      status: 'error',
      message: error.message || 'Ocurrió un error al guardar el carrito.',
    });
  }
};

export const getSingleCart = async (req, res) => {
  try {
    const cart = await cartRepository.getCart(req.params.cid);
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
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Ocurrió un error al obtener el carrito.',
    });
  }
};

export const removeProductFromCart = async (req, res) => {
  try {
    await cartRepository.deleteProductFromCart(req.params.cid, req.params.pid);
    res.status(200).json({
      status: 'success',
      message: 'Producto eliminado del carrito.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Ocurrió un error al eliminar el producto del carrito.',
    });
  }
};

export const updateWholeCart = async (req, res) => {
  try {
    await cartRepository.updateCart(req.params.cid, req.body.products);
    res.status(200).json({
      status: 'success',
      message: 'Carrito actualizado.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Ocurrió un error al actualizar el carrito.',
    });
  }
};

export const updateProductQuantityInCart = async (req, res) => {
  try {
    await cartRepository.updateProductInCart(req.params.cid, req.params.pid, req.body.quantity);
    res.status(200).json({
      status: 'success',
      message: 'Cantidad del producto en el carrito actualizada.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Ocurrió un error al actualizar la cantidad del producto en el carrito.',
    });
  }
};

export const removeCart = async (req, res) => {
  try {
    await cartRepository.deleteCart(req.params.cid);
    res.status(200).json({
      status: 'success',
      message: 'Todos los productos eliminados del carrito.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Ocurrió un error al eliminar todos los productos del carrito.',
    });
  }
};

export const purchaseCard = async (req, res) => {
  try {
    const cardId = req.params.cid;
    const result = await cartRepository.purchase(cardId, req.user); // Pasa el usuario autenticado a la función purchase
    res.status(200).json({
      status: 'success',
      message: 'Finalización de compra completa',
      result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Ocurrió un error al finalizar la compra.',
    });
  }
};