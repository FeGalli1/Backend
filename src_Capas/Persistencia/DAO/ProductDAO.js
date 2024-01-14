import { Product } from '../models/ProductModel.js';

export const getAllProducts = async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;

  const queryFilter = query ? { category: query.trim() } : {};

  try {
    const products = await Product.find(queryFilter)
      .sort(sort ? { price: sort === 'asc' ? 1 : -1 } : {})
      .skip((page - 1) * limit)
      .limit(limit);

    const totalProducts = await Product.countDocuments(queryFilter);
    const totalPages = Math.ceil(totalProducts / limit);

    const response = {
      status: 'success',
      payload: products,
      totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      page,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink: page > 1 ? `/api/products?page=${page - 1}&limit=${limit}&query=${query}` : null,
      nextLink: page < totalPages ? `/api/products?page=${page + 1}&limit=${limit}&query=${query}` : null,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Ocurrió un error al procesar la petición.',
    });
  }
};

export const createProduct = async (req, res) => {
  const { name, photo, price, category, description } = req.body;

  if (!name || !photo || !price || !category || !description) {
    return res.status(400).json({
      status: 'error',
      message: 'Todos los campos son obligatorios.',
    });
  }

  try {
    const product = new Product({
      name,
      photo,
      price,
      category,
      description,
    });

    const productSave = await product.save();

    res.status(200).json({
      status: 'success',
      message: 'Producto guardado exitosamente.',
      product: productSave,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Ocurrió un error al guardar el producto.',
    });
  }
};

export const getProductById = async (productId) => {
  try {
    const product = await Product.findById(productId);
    return product;
  } catch (error) {
    console.error(error);
    throw new Error('Error al obtener el producto por ID.');
  }
};
