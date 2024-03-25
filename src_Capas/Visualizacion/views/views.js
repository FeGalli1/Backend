import { getProductByIdController, getProducts } from '../../Controles/controllers/ProductsControllers.js'
import { logError } from '../../Errores/Winston.js'
import { getUserById } from '../../Persistencia/DAO/userDAO.js'
import { Product } from '../../Persistencia/models/ProductModel.js'

export const viewsRouter = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query
        // const skip = (page - 1) * limit

        // const products = await Product.find().skip(skip).limit(limit)
        const products = await getProducts(req, res)
        const totalProducts = await Product.countDocuments()
        const totalPages = Math.ceil(totalProducts / limit)

        const prevLink = page > 1 ? `/products?page=${page - 1}&limit=${limit}` : null
        const nextLink = page < totalPages ? `/products?page=${page + 1}&limit=${limit}` : null

        res.render('products', { products, prevLink, nextLink, user: req.session.user })
    } catch (error) {
        logError(error)
        res.status(500).send('Error al obtener la lista de productos')
    }
}
export const renderProductDetails = async (req, res) => {
    try {
        const product = await getProductByIdController(req, res)

        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Producto no encontrado.',
            })
        }

        res.render('product-details', { product })
    } catch (error) {
        logError(error)
        res.status(500).json({
            status: 'error',
            message: 'Ocurrió un error al obtener los detalles del producto.',
        })
    }
}

export const renderPerfil = async (req, res) => {
    try {
        const usC = req.session.user
        const user = await getUserById(usC._id)
        const profileImages = []
        const defaultImagePath = '/../../../documents/fotoBlanco.jpg' // Buscar la imagen de perfil para cada usuario
        const profileDocument = user.documents.find(document => document.name === 'profile')
        if (profileDocument) {
            const base64Image = `data:image/${profileDocument.name.split('.').pop()};base64,${profileDocument.content}`
            profileImages.push(base64Image)
        } else {
            console.log('no hay foto ', user.documents)
            // Si no hay imagen de perfil, se puede usar una imagen predeterminada
            profileImages.push(defaultImagePath)
        }
        // En la función renderPerfil
        const profileImage = profileImages[0] // Tomar la primera imagen del array
        const message = req.session.successDocProfile
        delete req.session.successDocProfile
        res.render('perfil', { user, profileImage, message }) // Pasar solo la imagen de perfil en lugar de profileImages
    } catch (error) {
        res.status(500).json({
            status: error,
            message: 'error al cargar el perfil',
        })
    }
}
