import { Faker, es, en } from '@faker-js/faker'
import { logError } from '../../Errores/Winston.js'
const fakerEN = new Faker({ locale: [en] })
const faker = new Faker({ locale: [es] })

const generateMockProduct = () => {
    return {
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        photo: faker.image.url,
        price: parseFloat(faker.commerce.price()),
        category: faker.commerce.department(),
        description: fakerEN.commerce.productDescription(),
        stock: fakerEN.number.int({ min: 1, max: 100 }),
    }
}

// Función para generar un array de productos simulados
const generateMockProducts = quantity => {
    const mockProducts = []
    for (let i = 0; i < quantity; i++) {
        mockProducts.push(generateMockProduct())
    }
    return mockProducts
}

export const mockingProductsEndpoint = (req, res) => {
    try {
        const { page = 1 } = req.query
        const limit = 10
        const quantity = 100
        const mockProducts = generateMockProducts(quantity)

        const skip = (page - 1) * limit
        const paginatedProducts = mockProducts.slice(skip, skip + limit)

        const totalProducts = mockProducts.length
        const totalPages = Math.ceil(totalProducts / limit)

        const prevLink = page > 1 ? `/mockingproducts?page=${parseInt(page) - 1}` : null
        const nextLink = page < totalPages ? `/mockingproducts?page=${parseInt(page) + 1}` : null

        // Elimina la línea `console.log(paginatedProducts)`

        res.render('productMock', { paginatedProducts, prevLink, nextLink, user: req.session.user })
    } catch (error) {
        logError(error)
        res.status(500).send('Error al obtener la lista de productos simulados')
    }
}
