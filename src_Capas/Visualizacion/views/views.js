import { getProductByIdController, getProducts } from '../../Controles/controllers/ProductsControllers.js';
import { logError } from '../../Errores/Winston.js';
import ProductRepository from '../../Persistencia/DAO/ProductRepository.js';
import { Product } from '../../Persistencia/models/ProductModel.js'

export const viewsRouter = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query
        const skip = (page - 1) * limit

        // const products = await Product.find().skip(skip).limit(limit)
        const products = await getProducts(req, res);
        const totalProducts = await Product.countDocuments()
        const totalPages = Math.ceil(totalProducts / limit)

        const prevLink = page > 1 ? `/products?page=${page - 1}&limit=${limit}` : null
        const nextLink = page < totalPages ? `/products?page=${page + 1}&limit=${limit}` : null

        res.render('products', { products, prevLink, nextLink,  user: req.session.user });
    } catch (error) {
        logError(error)
        res.status(500).send('Error al obtener la lista de productos')
    }
}
export const renderProductDetails = async (req, res) => {
    try {
        const product = await getProductByIdController(req, res);

        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Producto no encontrado.',
            });
        }

        res.render('product-details', { product });
    } catch (error) {
        logError(error);
        res.status(500).json({
            status: 'error',
            message: 'Ocurrió un error al obtener los detalles del producto.',
        });
    }
};
