import { Product } from '../models/ProductModel.js'

export const getProducts = async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query

        // Construir la consulta de MongoDB con la lógica de filtrado por categoría
        const queryFilter = query ? { category: query.trim() } : {}
        // Aplicar filtros y paginación utilizando Mongoose
        const products = await Product.find(queryFilter)
            .sort(sort ? { price: sort === 'asc' ? 1 : -1 } : {})
            .skip((page - 1) * limit)
            .limit(limit)

        // Obtener el total de productos para calcular el número de páginas
        const totalProducts = await Product.countDocuments(queryFilter)

        // Calcular el número total de páginas
        const totalPages = Math.ceil(totalProducts / limit)

        // Construir el objeto de respuesta
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
        }

        res.status(200).json(response)
    } catch (error) {
        console.error(error)
        res.status(500).json({
            status: 'error',
            message: 'Ocurrió un error al procesar la petición.',
        })
    }
}

export const saveProduct = async (req, res) => {
    try {
        const { name, photo, price, category, description } = req.body

        // Validación de entrada
        if (!name || !photo || !price || !category || !description) {
            return res.status(400).json({
                status: 'error',
                message: 'Todos los campos son obligatorios.',
            })
        }

        // Crear un nuevo producto
        const product = new Product({
            name,
            photo,
            price,
            category,
            description,
        })

        // Guardar el producto en la base de datos
        const productSave = await product.save()

        // Enviar respuesta exitosa
        res.status(200).json({
            status: 'success',
            message: 'Producto guardado exitosamente.',
            product: productSave,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            status: 'error',
            message: 'Ocurrió un error al guardar el producto.',
        })
    }
}
