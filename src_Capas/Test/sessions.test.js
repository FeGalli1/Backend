import { expect } from 'chai'
import supertest from 'supertest'
import config from '../config.js'
import { describe, it } from 'mocha'

const PORT = config.PORT
const requester = supertest(`http://localhost:${PORT}`)

describe('Autenticación de usuario', () => {
    let cookie

    it('Debería iniciar sesión correctamente con credenciales válidas', async () => {
        const body = {
            email: 'Prueba@gmail.com',
            password: '12345678',
        }

        try {
            const response = await requester.post('/api/sessionsRoutes/login').send(body)
            expect(response.status).to.equal(200)
            expect(response.header['set-cookie']).to.be.an('array').that.is.not.empty
            const cookieHeader = response.header['set-cookie'][0]
            cookie = {
                name: cookieHeader.split('=')[0],
                value: cookieHeader.split('=')[1].split(';')[0],
            }
        } catch (error) {
            throw new Error(`Error al iniciar sesión: ${error.message}`)
        }
    })

    it('Debería devolverme el current de la sesión', async () => {
        if (!cookie) {
            throw new Error('Cookie de sesión no encontrada')
        }

        try {
            const response = await requester
                .get('/api/sessionsRoutes/current')
                .set('Cookie', `${cookie.name}=${cookie.value}`)
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('status', 'success')
            expect(response.body.user).to.exist
            expect(response.body.user.email).to.equal('Prueba@gmail.com')
        } catch (error) {
            throw new Error(`Error al obtener el usuario actual: ${error.message}`)
        }
    })

    it('Debería cerrar sesión correctamente', async () => {
        if (!cookie) {
            throw new Error('Cookie de sesión no encontrada')
        }

        try {
            const response = await requester
                .get('/api/sessionsRoutes/logout')
                .set('Cookie', `${cookie.name}=${cookie.value}`)
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('status', 'success')
            expect(response.body).to.have.property('message', 'Logout successful')
        } catch (error) {
            throw new Error(`Error al cerrar sesión: ${error.message}`)
        }
    })
})
