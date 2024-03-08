import mongoose from 'mongoose'
import config from '../config.js'
import User from '../Persistencia/models/UserModel.js'
import { Cart } from '../Persistencia/models/CartsModel.js'
import { Product } from '../Persistencia/models/ProductModel.js'
import { expect } from 'chai'
// import { describe, it, before, after } from 'mocha'

//este archivo lo hice para probar el before y after
const url = config.MONGO_URL_SOLO

describe('Conexión a la base de datos y operaciones', () => {
    describe('Abrir conexión con el servidor', () => {
        before(async () => {
            try {
                mongoose.set('strictQuery', false)
                await mongoose.connect(`${url}/test`, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                })
            } catch (error) {
                console.log('Error en el test de conexión a la base de datos', error)
            }
        })

        it('Debería abrir conexión con el servidor', () => {
            expect(mongoose.connection.readyState).to.equal(1) // 1 significa que la conexión está abierta
        })

        describe('Obtener colecciones', () => {
            it('Debería obtener las colecciones de usuarios, carritos y productos', async () => {
                // Obtener las colecciones
                const userCollection = await User.find()
                const cartCollection = await Cart.find()
                const productCollection = await Product.find()

                // Agrega aserciones para verificar que las colecciones no estén vacías o que tengan un cierto número de documentos.
                expect(userCollection.length).to.be.above(0)
                expect(cartCollection.length).to.be.above(0)
                expect(productCollection.length).to.be.above(0)
            })
        })

        after(async () => {
            mongoose.connection.close()
        })
    })

    it('Debería cerrar el servidor', () => {
        expect(mongoose.connection.readyState).to.equal(0) // 0 significa que la conexión está cerrada
    })
})
