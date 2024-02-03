// ProductDAO.js
import { Product } from '../models/ProductModel.js';

const createError = (status, message) => ({ status, message });

export const getAllProducts = async (limit, page, sort, query) => {
  const queryFilter = query ? { category: query.trim() } : {};
  const products = await Product.find(queryFilter)
    .sort(sort ? { price: sort === 'asc' ? 1 : -1 } : {})
    .skip((page - 1) * limit)
    .limit(limit);

  const totalProducts = await Product.countDocuments(queryFilter);
  const totalPages = Math.ceil(totalProducts / limit);

  return products;
};

export const createProduct = async (name, photo, price, category, description) => {
  try {
    if (!name || !photo || !price || !category || !description) {
      throw createError(400, 'Todos los campos son obligatorios.');
    }

    const product = new Product({
      name,
      photo,
      price,
      category,
      description,
    });

    return await product.save();
  } catch (error) {
    throw createError(500, 'Error al crear el producto en la base de datos.');
  }
};

export const getProductById = async (productId) => {
  try {
    console.log(productId)
    const product = await Product.findById(productId);
    if (!product) {
      throw createError(404, 'Producto no encontrado.');
    }

    return product;
  } catch (error) {
    throw createError(500, 'Error al obtener el producto desde la base de datos.');
  }
};

export const deleteProductById = async (productId) => {
  try {
    const result = await Product.deleteOne({ _id: productId });
    if (result.deletedCount === 0) {
      throw createError(404, 'Producto no encontrado para eliminar.');
    }
  } catch (error) {
    
    t
throw createError(500, 'Error al eliminar el producto desde la base de datos.');
  }
};

export const updateProductById = async (productId, updatedProductData) => {
  try {
      // Verifica si el producto existe
      const existingProduct = await Product.findById(productId);
      if (!existingProduct) {
          throw createError(404, 'Producto no encontrado.');
      }

      // Actualiza los campos del producto con los datos proporcionados
      existingProduct.set(updatedProductData);

      // Guarda los cambios en la base de datos
      const updatedProduct = await existingProduct.save();

      return updatedProduct;
  } catch (error) {
      // Puedes personalizar la forma en que manejas el error según tus necesidades
      throw createError(500, 'Error al actualizar el producto en la base de datos.');
  }
};