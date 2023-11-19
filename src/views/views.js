// views/views.js

import { getProductById } from '../controllers/ProductsControllers.js'
import { Product } from '../models/ProductModel.js'

export const viewsRouter = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query
        const skip = (page - 1) * limit

        const products = await Product.find().skip(skip).limit(limit)

        const totalProducts = await Product.countDocuments()
        const totalPages = Math.ceil(totalProducts / limit)

        const prevLink = page > 1 ? `/products?page=${page - 1}&limit=${limit}` : null
        const nextLink = page < totalPages ? `/products?page=${page + 1}&limit=${limit}` : null

        res.render('products', { products, prevLink, nextLink })
    } catch (error) {
        console.error(error)
        res.status(500).send('Error al obtener la lista de productos')
    }
}
export const renderProductDetails = async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await getProductById(productId);

        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Producto no encontrado.',
            });
        }

        res.render('product-details', { product });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Ocurrió un error al obtener los detalles del producto.',
        });
    }
};
