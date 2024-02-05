import { createError, errors } from '../../Errores/errorModule.js';
import ProductRepository from '../../Persistencia/DAO/ProductRepository.js';

const productRepository = ProductRepository;

export const getProducts = async (req, res) => {
    try {
        const products = await productRepository.getAllProducts(req.query.limit, req.query.page, req.query.sort, req.query.query);
        return products;
    } catch (error) {
        console.error(error);
        const errorDetails = createError(errors.PRODUCT_REQUEST_ERROR);
        res.status(errorDetails.status).json({ status: 'error', error: errorDetails.message });
    }
};

export const saveProduct = async (req, res) => {
    try {
        const { name, photo, price, category, description } = req.body;
        const newProduct = await productRepository.createProduct(name, photo, price, category, description);
        res.status(200).json({
            status: 'success',
            message: 'Producto guardado exitosamente.',
            product: newProduct,
        });
    } catch (error) {
        console.error(error);
        const errorDetails = createError(errors.PRODUCT_SAVE_ERROR);
        res.status(errorDetails.status).json({ status: 'error', error: errorDetails.message });
    }
};

export const getProductByIdController = async (req, res) => {
    try {
        const product = await productRepository.getProductById(req.params.productId);
        if (!product) {
            const errorDetails = createError(errors.PRODUCT_NOT_FOUND);
            return res.status(errorDetails.status).json({ status: 'error', error: errorDetails.message });
        }
        return product;
    } catch (error) {
        console.error(error);
        const errorDetails = createError(errors.PRODUCT_REQUEST_ERROR);
        res.status(errorDetails.status).json({ status: 'error', error: errorDetails.message });
    }
};

export const deleteProductByIdController = async (req, res) => {
    try {
        const productId = req.params.id;
        await productRepository.deleteProductById(productId);
        res.status(200).json({
            status: 'success',
            message: 'Producto eliminado exitosamente.',
        });
    } catch (error) {
        console.error(error);
        const errorDetails = createError(errors.PRODUCT_DELETE_ERROR);
        res.status(errorDetails.status).json({ status: 'error', error: errorDetails.message });
    }
};

export const updateProductByIdController = async (productId, updatedProductData) => {
    try {
        const updatedProduct = await productRepository.updateProductById(productId, updatedProductData);
        return updatedProduct;
    } catch (error) {
        console.error(error);
        const errorDetails = createError(errors.PRODUCT_UPDATE_ERROR);
        throw errorDetails;
    }
};
