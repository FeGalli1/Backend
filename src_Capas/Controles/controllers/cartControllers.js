import { logError, logWarning } from '../../Errores/Winston.js';
import { createError, errors } from '../../Errores/errorModule.js';
import CartRepository from '../../Persistencia/DAO/CartRepository.js';

const cartRepository = CartRepository;

export const getCarts = async (req, res) => {
    try {
        const carts = await cartRepository.getAllCarts();
        res.status(200).json({
            status: 'success',
            payload: carts,
        });
    } catch (error) {
        console.error(error);
        const errorDetails = createError(errors.CARRITOS_NOT_FOUND);
        res.status(errorDetails.status).json({ status: 'error', error: errorDetails.message });
    }
};

export const saveCart = async (req, res) => {
    try {
        const { product, quantity } = req.body;
        const user = req.user; // Obtener el usuario desde req.user

        // Verificar si el usuario es premium
        if (user.role === 'premium') {
            // Verificar si el producto fue creado por el usuario
            if (product.owner === user._id) {
                // Si el producto fue creado por el usuario, devolver un error
                logWarning(`el usuario ${user} intento agregar un producto propio al carrito`)
                return res.status(400).json({
                    status: 'error',
                    message: 'No puedes agregar tu propio producto al carrito.',
                });
            }
        }
        // Si el usuario no es premium o si el producto no fue creado por él, proceder a guardar el carrito
        const newCart = await cartRepository.createCart(product, quantity);
        res.status(200).json({
            status: 'success',
            message: 'Carrito guardado exitosamente.',
            cart: newCart,
        });
    } catch (error) {
        console.error(error);
        const errorDetails = createError(errors.CARRITO_NOT_SAVE);
        res.status(errorDetails.status).json({ status: 'error', error: errorDetails.message });
    }
};


export const getSingleCart = async (req, res) => {
    try {
        const cart = await cartRepository.getCart(req.params.cid);
        if (!cart) {
            const errorDetails = createError(errors.CARRITO_NOT_FOUND);
            return res.status(errorDetails.status).json({ status: 'error', error: errorDetails.message });
        }

        res.status(200).json({
            status: 'success',
            payload: cart,
        });
    } catch (error) {
        console.error(error);
        const errorDetails = createError(errors.CARRITO_NOT_O);
        res.status(errorDetails.status).json({ status: 'error', error: errorDetails.message });
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
        const errorDetails = createError(errors.CARRITO_NO_ELIMINADO);
        res.status(errorDetails.status).json({ status: 'error', error: errorDetails.message });
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
        const errorDetails = createError(errors.CARRITO_UPDATE_ERROR);
        res.status(errorDetails.status).json({ status: 'error', error: errorDetails.message });
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
        const errorDetails = createError(errors.CARRITO_PRODUCT_QUANTITY_UPDATE_ERROR);
        res.status(errorDetails.status).json({ status: 'error', error: errorDetails.message });
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
        const errorDetails = createError(errors.CARRITO_REMOVE_ERROR);
        res.status(errorDetails.status).json({ status: 'error', error: errorDetails.message });
    }
};

export const purchaseCard = async (req, res) => {
    try {
        const cardId = req.params.cid;
        const result = await cartRepository.purchase(cardId, req.user);
        if (result.error) {
            res.status(500).json({
                status: 'error',
                message: result.error,
            });
        } else {
            res.status(200).json({
                status: 'success',
                message: 'Finalización de compra completa',
                ticketId: result.ticket._id,
            });
        }
    } catch (error) {
        console.error(error);
        const errorDetails = createError(errors.CARRITO_PURCHASE_ERROR);
        res.status(errorDetails.status).json({ status: 'error', error: errorDetails.message });
    }
};
