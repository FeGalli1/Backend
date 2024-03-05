// CartRepository.js
import * as CartDAO from './CartDAO.js'

class CartRepository {
    async getAllCarts() {
        return await CartDAO.getAllCarts()
    }

    async createCart(product, quantity) {
        // Implementa la lógica para crear un carrito
        return await CartDAO.createCart(product, quantity)
    }

    async getCart(cartId) {
        // Implementa la lógica para obtener un carrito por su ID
        return await CartDAO.getCart(cartId)
    }

    async deleteProductFromCart(cartId, productId) {
        // Implementa la lógica para eliminar un producto del carrito
        return await CartDAO.deleteProductFromCart(cartId, productId)
    }

    async updateCart(cartId, updatedProducts) {
        // Implementa la lógica para actualizar el carrito completo
        return await CartDAO.updateCart(cartId, updatedProducts)
    }

    async updateProductInCart(cartId, productId, updatedQuantity) {
        // Implementa la lógica para actualizar la cantidad de un producto en el carrito
        return await CartDAO.updateProductInCart(cartId, productId, updatedQuantity)
    }

    async deleteCart(cartId) {
        // Implementa la lógica para eliminar un carrito
        return await CartDAO.deleteCart(cartId)
    }

    async purchase(cartId, user) {
        return CartDAO.purchase(cartId, user)
    }
}

export default new CartRepository()
