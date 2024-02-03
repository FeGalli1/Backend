import ProductRepository from '../../Persistencia/DAO/ProductRepository.js';

const productRepository = ProductRepository;

export const getProducts = async (req, res) => {
  try {
    const products = await productRepository.getAllProducts(req.query.limit, req.query.page, req.query.sort, req.query.query);
    return products;
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
    const { name, photo, price, category, description } = req.body;
    const newProduct = await productRepository.createProduct(name, photo, price, category, description);
    res.status(200).json({
      status: 'success',
      message: 'Producto guardado exitosamente.',
      product: newProduct,
    });
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
    const product = await productRepository.getProductById(req.params.productId);
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Producto no encontrado.',
      });
    }
    return product;
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Ocurrió un error al obtener el producto.',
    });
  }
};
export const deleteProductByIdController = async (req, res) => {
  try {
    const productId = req.params.id;

    // Realiza la lógica para eliminar el producto por ID utilizando el repositorio
    await productRepository.deleteProductById(productId);

    res.status(200).json({
      status: 'success',
      message: 'Producto eliminado exitosamente.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Ocurrió un error al eliminar el producto.',
    });
  }
};

export const updateProductByIdController = async (productId, updatedProductData) => {
  try {
      // Implementa la lógica para actualizar el producto en el repositorio
      const updatedProduct = await productRepository.updateProductById(productId, updatedProductData);
      return updatedProduct;
  } catch (error) {
      throw error; // Puedes manejar el error según tus necesidades
  }
};