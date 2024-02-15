// ProductRepository.js
import * as ProductDAO from './ProductDAO.js';

class ProductRepository {
  async getAllProducts(limit, page, sort, query) {
    // Implementa la lógica para obtener todos los productos
    return await ProductDAO.getAllProducts(limit, page, sort, query);
  }

  async createProduct(name, photo, price, category, description) {
    // Implementa la lógica para crear un producto
    return await ProductDAO.createProduct(name, photo, price, category, description);
  }

  async getProductById(productId) {
    // Implementa la lógica para obtener un producto por su ID
    return await ProductDAO.getProductById(productId);
  }
  async updateProductById(productId, updatedProductData) { 
    try {
        // Implementa la lógica para actualizar el producto en el repositorio de datos
        const updatedProduct = await ProductDAO.updateProductById(productId, updatedProductData);
        return updatedProduct;
    } catch (error) {
        throw error; // Puedes manejar el error según tus necesidades
    }
}
}

export default new ProductRepository();
