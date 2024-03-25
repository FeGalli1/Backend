import { Product } from '../models/ProductModel.js'
import { logError, logInfo } from '../../Errores/Winston.js'

const createError = (status, message) => ({ status, message })

export const getAllProducts = async (limit, page, sort, query) => {
    try {
        const queryFilter = query ? { category: query.trim() } : {}
        const products = await Product.find(queryFilter)
            .sort(sort ? { price: sort === 'asc' ? 1 : -1 } : {})
            .skip((page - 1) * limit)
            .limit(limit)

        // const totalProducts = await Product.countDocuments(queryFilter);
        // const totalPages = Math.ceil(totalProducts / limit);

        return products
    } catch (error) {
        throw logError(500, 'Error al obtener los productos desde la base de datos.')
    }
}
export const createProduct = async (name, photo, price, category, description, stock, ownerId = 'admin') => {
    if (!name || !photo || !price || !category || !description) {
        throw createError(400, 'Todos los campos son obligatorios.')
    }

    const product = new Product({
        name,
        photo,
        price,
        category,
        description,
        stock,
        ownerId,
    })
    logInfo(product)

    await product.save()
    logInfo('Producto creado correctamente.')
    return product
}

export const getProductById = async productId => {
    try {
        const product = await Product.findById(productId)
        if (!product) {
            throw createError(404, 'Producto no encontrado.')
        }

        logInfo(`Producto con ID ${productId} obtenido correctamente.`)
        return product
    } catch (error) {
        throw logError(500, 'Error al obtener el producto desde la base de datos.')
    }
}
export const getProductByOwner = async ownerId => {
    try {
        const products = await Product.find({ owner: ownerId }).exec()
        return products
    } catch (error) {
        throw new Error('Error al obtener los productos por owner: ' + error.message)
    }
}

export const deleteProductById = async productId => {
    try {
        const result = await Product.deleteOne({ _id: productId })
        if (result.deletedCount === 0) {
            throw createError('Producto no encontrado para eliminar.')
        }

        logInfo(`Producto con ID ${productId} eliminado correctamente.`)
    } catch (error) {
        throw logError('Error al eliminar el producto desde la base de datos.')
    }
}

export const updateProductById = async (productId, updatedProductData) => {
    try {
        const existingProduct = await Product.findById(productId)
        if (!existingProduct) {
            throw createError(404, 'Producto no encontrado.')
        }

        existingProduct.set(updatedProductData)
        const updatedProduct = await existingProduct.save()

        logInfo(`Producto con ID ${productId} actualizado correctamente.`)
        return updatedProduct
    } catch (error) {
        throw logError(500, 'Error al actualizar el producto en la base de datos.')
    }
}
