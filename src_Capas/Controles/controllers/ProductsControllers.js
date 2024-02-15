import { logError, logInfo } from '../../Errores/Winston.js';
import { createError, errors } from '../../Errores/errorModule.js';
import ProductRepository from '../../Persistencia/DAO/ProductRepository.js';

const productRepository = ProductRepository;

export const getProducts = async (req, res) => {
    try {
        const products = await productRepository.getAllProducts(req.query.limit, req.query.page, req.query.sort, req.query.query);
        return products;
    } catch (error) {
        logError(error);
        const errorDetails = createError(errors.PRODUCT_REQUEST_ERROR);
        res.status(errorDetails.status).json({ status: 'error', error: errorDetails.message });
    }
};

export const saveProduct = async (req, res) => {
    try {
        const { name, photo, price, category, description,stock } = req.body;
        // Obtener el _id del usuario desde req.user._id
        const ownerId = req.user._id;
        
        // Verificar si el usuario es premium
        if (req.user.role === 'premium') {
            // Crear el producto con el owner del usuario premium
            const newProduct = await productRepository.createProduct(name, photo, price, category, description,stock, ownerId);
            res.render('product-save-success');
        } else {
            // Si el usuario no es premium, guardar el producto sin owner
            const newProduct = await productRepository.createProduct(name, photo, price, category, description,stock);
            res.render('product-save-success');
        } 
    } catch (error) {
        logError(error);
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
        logError(error);
        const errorDetails = createError(errors.PRODUCT_REQUEST_ERROR);
        res.status(errorDetails.status).json({ status: 'error', error: errorDetails.message });
    }
};

// Controlador para eliminar un producto por ID
export const deleteProductByIdController = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await productRepository.getProductById(productId);
        logInfo(product.owner)
        logInfo(req.user._id)
        logInfo(req.user.role)
        // Verificar si el producto existe antes de intentar eliminarlo
        if (!product) {
            const errorDetails = createError(errors.PRODUCT_NOT_FOUND);
            return res.status(errorDetails.status).json({ status: 'error', error: errorDetails.message });
        }

        // Verificar si el usuario es administrador o premium y si es dueño del producto
        if (req.user.role === 'admin' || (req.user.role === 'premium' && product.owner.toString() === req.user._id.toString())) {
            await productRepository.deleteProductById(productId);
            res.status(200).json({
                status: 'success',
                message: 'Producto eliminado exitosamente.',
            });
        } else {
            res.status(403).json({ status: 'error', message: 'Acceso no autorizado para eliminar este producto.' });
        }
    } catch (error) {
        logError(error);
        const errorDetails = createError(errors.PRODUCT_DELETE_ERROR);
        res.status(errorDetails.status).json({ status: 'error', error: errorDetails.message });
    }
}; 

// Controlador para actualizar un producto por ID
export const updateProductByIdController = async (req, res) => {
    const productId = req.params.id;
    const updatedProductData = req.body;

    try {
        // Obtener el producto
        const product = await productRepository.getProductById(productId);

        // Verificar si el producto existe
        if (!product) {
            throw createError(404, 'Producto no encontrado.');
        }

        // Verificar si el usuario es administrador o premium y si es dueño del producto
        if (req.user.role === 'admin' || (req.user.role === 'premium' && product.owner.toString() === req.user._id.toString())) {
            // Actualizar el producto
            await productRepository.updateProductById(productId, updatedProductData);
            res.render('product-edit-res', {error: 0})
        } else {
            // Usuario no autorizado para actualizar el producto
            return  res.render('product-edit-res', {error: 'Acceso no autorizado para actualizar este producto.'})
        }
    } catch (error) {
        logError(error);
        const errorDetails = createError(errors.PRODUCT_UPDATE_ERROR);
        res.status(errorDetails.status).json({ status: 'error', error: errorDetails.message });
    }
};
