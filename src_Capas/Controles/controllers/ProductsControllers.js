import { getAllProducts, createProduct, getProductById } from '../../persistencia/DAO/ProductDAO.js';

export const getProducts = async (req, res) => {
  try {
    await getAllProducts(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Ocurrió un error al procesar la petición.',
    });
  }
};

export const saveProduct = async (req, res) => {
  try {
    await createProduct(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Ocurrió un error al guardar el producto.',
    });
  }
};

export const getProductByIdController = async (req, res) => {
  try {
    const product = await getProductById(req.params.productId);
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Producto no encontrado.',
      });
    }

    res.status(200).json({
      status: 'success',
      payload: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Ocurrió un error al obtener el producto.',
    });
  }
};
