import express from 'express';
import { isAdmin } from '../Controles/middleware/authMiddleware.js';
import { getProducts, getProductByIdController, saveProduct, deleteProductByIdController, updateProductByIdController } from '../Controles/controllers/ProductsControllers.js';
import { logError, logInfo } from '../Errores/Winston.js';

const adminRouter = express.Router();

// Middleware para todas las rutas de adminRouter
adminRouter.use(isAdmin);

adminRouter.get('/', async (req, res ) =>{
    res.render('admin');
    
})

// Ruta para visualizar y editar productos
adminRouter.get('/productos', async (req, res) => {
    try {
        // Obtén los productos utilizando la función del controlador
        const products = await getProducts(req, res);
        res.render('adminProducts', { products });
    } catch (error) {
        logError(error);
        res.status(500).json({
            status: 'error',
            message: 'Ocurrió un error al obtener los productos.',
        });
    }
});

adminRouter.get('/productos/:id/editar', async (req, res) => {
    try {
        // Obtén el productId de los parámetros de la URL
        const productId = req.params.id;

        // Llama a getProductByIdController con el productId
        const product = await getProductByIdController({ params: { productId } }, res);

        // Verifica si el producto se obtuvo correctamente
        if (product) {
            res.render('product-edit', { product });
        } else {
            res.status(404).json({
                status: 'error',
                message: 'Producto no encontrado.',
            });
        }
    } catch (error) {
        logError(error);
        res.status(500).json({
            status: 'error',
            message: 'Ocurrió un error al obtener el producto para editar.',
        });
    }
});



adminRouter.get('/productos/:id/eliminar', async (req, res) => {
    try {
 
        await deleteProductByIdController(req, res);
        res.redirect('/admin/productos');
    } catch (error) {
        logError(error);
        res.status(500).json({
            status: 'error',
            message: 'Ocurrió un error al eliminar el producto.',
        });
    }
});

adminRouter.get('/productos/nuevo', (req, res) => {
    // Lógica para renderizar la vista de carga de nuevo producto
    res.render('product-create');
});


adminRouter.post('/productos/nuevo', async (req, res) => {
    try {
        // Procesa la carga de un nuevo producto utilizando la función del controlador
         // Obtiene el nuevo producto del cuerpo de la solicitud
         const nuevoProducto = req.body;

         // Verifica si el objeto nuevoProducto está presente
         if (!nuevoProducto) {
             return res.status(400).json({
                 status: 'error',
                 message: 'Datos del nuevo producto no proporcionados.',
             });
         }
         await saveProduct(req, res);
        } catch (error) {
            logError(error);
            res.status(500).json({
                status: 'error',
                message: 'Ocurrió un error al procesar la carga del nuevo producto.',
            });
        }
    });
// Ruta para procesar la actualización de un producto (POST)
adminRouter.post('/productos/:id/editar', async (req, res) => {
    try {

        // Llama a la función del controlador para manejar la lógica de actualización del producto
        await updateProductByIdController(req, res);


    } catch (error) {
        logError(error);
        res.status(500).json({
            status: 'error',
            message: 'Ocurrió un error al procesar la actualización del producto.',
        });
    }
});





export default adminRouter;
