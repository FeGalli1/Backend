import { expect } from 'chai'
import supertest from 'supertest'
import config from '../config.js'
import { describe, it } from 'mocha'

const PORT = config.PORT
const requester = supertest(`http://localhost:${PORT}`)

describe('Router de productos', () => {
    it('Debería obtener todos los productos', done => {
        requester
            .get('/api/product')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err)
                expect(res.body).to.be.an('array')
                // Agrega más aserciones según sea necesario
                done()
            })
    })

    it('Debería crear un nuevo producto', async () => {
        const newProduct = {
            name: 'Nuevo producto de test',
            photo: 'url_de_la_foto',
            price: 10,
            category: 'computers',
            description: 'Descripción del nuevo producto',
            stock: 1,
            test: 1,
        }

        // Realiza la solicitud POST para crear un nuevo producto
        const response = await requester.post('/api/product').send(newProduct)

        // Verifica el statusCode de la respuesta
        expect(response.statusCode).to.equal(200)

        // Verifica si el cuerpo de la respuesta es un array
        expect(response.body).to.be.an('object')
    })

    it('Debería eliminar un producto', done => {
        requester
            .delete('/api/product/')
            .expect(200)
            .end(err => {
                if (err) return done(err)
                // Agrega más aserciones según sea necesario
                done()
            })
    })
})
