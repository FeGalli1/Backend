// cartController.js

import { Cart } from '../models/CartsModel.js'

export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products')
        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: 'Carrito no encontrado.',
            })
        }

        res.status(200).json({
            status: 'success',
            payload: cart,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            status: 'error',
            message: 'Ocurrió un error al obtener el carrito.',
        })
    }
}

export const deleteProductFromCart = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid)
        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: 'Carrito no encontrado.',
            })
        }

        // Eliminar el producto del carrito
        cart.products.pull({ _id: req.params.pid })
        await cart.save()

        res.status(200).json({
            status: 'success',
            message: 'Producto eliminado del carrito.',
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            status: 'error',
            message: 'Ocurrió un error al eliminar el producto del carrito.',
        })
    }
}

export const updateCart = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid)
        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: 'Carrito no encontrado.',
            })
        }

        // Actualizar el carrito con el arreglo de productos
        cart.products = req.body.products
        await cart.save()

        res.status(200).json({
            status: 'success',
            message: 'Carrito actualizado.',
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            status: 'error',
            message: 'Ocurrió un error al actualizar el carrito.',
        })
    }
}
export const updateProductInCart = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid)
        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: 'Carrito no encontrado.',
            })
        }

        // Actualizar la cantidad del producto en el carrito
        const productInCart = cart.products.id(req.params.pid)
        if (productInCart) {
            productInCart.quantity = req.body.quantity
            await cart.save()
        }

        res.status(200).json({
            status: 'success',
            message: 'Cantidad del producto en el carrito actualizada.',
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            status: 'error',
            message: 'Ocurrió un error al actualizar la cantidad del producto en el carrito.',
        })
    }
}

export const deleteCart = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid)
        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: 'Carrito no encontrado.',
            })
        }

        // Eliminar todos los productos del carrito
        cart.products = []
        await cart.save()

        res.status(200).json({
            status: 'success',
            message: 'Todos los productos eliminados del carrito.',
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            status: 'error',
            message: 'Ocurrió un error al eliminar todos los productos del carrito.',
        })
    }
}
