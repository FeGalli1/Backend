// ProductRepository.js
import * as ProductDAO from './ProductDAO.js'

class ProductRepository {
    async getAllProducts(limit, page, sort, query) {
        // Implementa la lógica para obtener todos los productos
        return await ProductDAO.getAllProducts(limit, page, sort, query)
    }

    async createProduct(name, photo, price, category, description, owner = 'admin') {
        // Implementa la lógica para crear un producto
        return await ProductDAO.createProduct(name, photo, price, category, description, owner)
    }

    async getProductById(productId) {
        // Implementa la lógica para obtener un producto por su ID
        return await ProductDAO.getProductById(productId)
    }
    async updateProductById(productId, updatedProductData) {
        // Implementa la lógica para actualizar el producto en el repositorio de datos
        const updatedProduct = await ProductDAO.updateProductById(productId, updatedProductData)
        return updatedProduct
    }
    async deleteProductById(productId) {
        return await ProductDAO.deleteProductById(productId)
    }
}

export default new ProductRepository()
