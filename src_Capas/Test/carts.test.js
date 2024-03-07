import { expect } from 'chai'
import supertest from 'supertest'
import config from '../config.js'
import { describe, it } from 'mocha'

const PORT = config.PORT
const requester = supertest(`http://localhost:${PORT}`)

describe('Router de carritos', () => {
    it('Debería obtener todos los carritos de compra', done => {
        requester
            .get('/api/carts')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err)
                expect(res.body).to.be.an('object')
                // Agrega más aserciones según sea necesario
                done()
            })
    })
})
