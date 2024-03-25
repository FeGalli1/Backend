import express from 'express'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import cors from 'cors'
import { router } from './api/index.js'
import { renderPerfil, renderProductDetails, viewsRouter } from '../Visualizacion/views/views.js'
import bodyParser from 'body-parser'
import session from 'express-session'
import config from '../config.js'
import cookieParser from 'cookie-parser'
import routerLog from './routerLog.js'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import '../Controles/utils/Passport.js' // Asegúrate de que estás importando tu archivo passport.js correctamente
import adminRouter from './admin.js'
import { logError, logWarning, logInfo, logDebug } from '../Errores/Winston.js' // Importa tus funciones de log
import { notAdmin, requireAuth } from '../Controles/middleware/authMiddleware.js'
import { mockingProductsEndpoint } from '../Persistencia/Mock/mockingModule.js'
import { changeRole } from '../Controles/controllers/AuthController.js'
import methodOverride from 'method-override'
import flash from 'connect-flash'

import { createServer } from 'node:http'
import { Server } from 'socket.io'
import { setTimeout } from 'timers'

const createServerConfig = () => {
    const server = express()
    const swaggerDocument = YAML.load('./openapi.yml')

    server.use(cookieParser())
    server.use(bodyParser.urlencoded({ extended: false }))
    server.use(bodyParser.json())

    // Configuración de la sesión
    const sessionOptions = {
        secret: config.COOKIEKEY,
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ mongoUrl: config.MONGODB_ATLAS_CONNECTION_STRING, ttl: 3600 }),
        cookie: { maxAge: 3600000 }, // 1 hour
    }
    server.use(session(sessionOptions))

    server.use(flash())
    //para poder hacer put desde un form
    server.use(express.urlencoded({ extended: true }))
    server.use(methodOverride('_method'))

    server.use(passport.initialize())
    server.use(passport.session())

    server.use(cors())
    server.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    server.use('/api', router)

    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)

    // Servir archivos estáticos desde la carpeta 'documents'
    server.use('/documents', express.static(path.join(__dirname, '../../documents')))

    server.set('view engine', 'ejs')
    server.set('views', path.join(__dirname, '../Visualizacion/views'))

    server.get('/profile', requireAuth, renderPerfil)

    server.get('/products', notAdmin, viewsRouter)
    server.get('/products/:productId', notAdmin, renderProductDetails)

    // mocking
    server.get('/mockingproducts', notAdmin, mockingProductsEndpoint)

    // RUTA DE ADMINISTRADOR
    server.use('/admin', adminRouter)

    router.put('/users/premium/:uid', changeRole)

    // Rutas de login
    server.use('/', routerLog)

    // Endpoint para probar los logs
    server.get('/loggerTest', (req, res) => {
        logError('Esto es un error de prueba')
        logWarning('Esto es una advertencia de prueba')
        logInfo('Esto es un mensaje de información de prueba')
        logDebug('Esto es un mensaje de depuración de prueba')
        res.send('Logs registrados. Verifique el archivo errors.log para los errores.')
    })

    // CHAT CON WEBSOCKET
    const primerEnvio = () => {
        setTimeout(() => {
            io.emit('new message', Array.from(anonymousChats.values()))
        }, 2000)
    }

    server.get('/admin/chat/message', async (req, res) => {
        res.render('chat-admin')
        // le tuve que poner un timeOut porque se enviaba antes de cargar la pagina y generaba problemas
        primerEnvio()
    })

    server.get('/chat/mensaje', (req, res) => {
        res.render('chat-user.ejs')
    })

    const serverChat = createServer(server)
    const io = new Server(serverChat)
    const anonymousChats = new Map()

    io.on('connection', socket => {
        let messageHistory = []
        io.emit('mensaje', 'Bienvenido')

        // En el lado del servidor, deberías manejar el mensajePrivado así:
        socket.on('mensajePrivado', data => {
            const destinatario = data.destinatario
            const mensaje = data.mensaje

            // Aquí puedes usar socket.to(destinatario).emit para enviar el mensaje al destinatario específico
            logInfo(`envie el mensaje ${mensaje}`)
            io.to(destinatario).emit('mensaje', mensaje)
        })

        socket.on('user message', msg => {
            messageHistory.push({ sender: socket.id, message: msg })
            io.to(socket.id).emit('chat message', msg)

            anonymousChats.set(socket.id, {
                socketId: socket.id,
                lastMessage: msg,
                messageHistory: messageHistory,
            })
            io.emit('new message', Array.from(anonymousChats.values()))
        })

        // Manejar desconexión
        socket.on('disconnect', () => {
            anonymousChats.delete(socket.id)
            io.emit('new message', Array.from(anonymousChats.values()))
        })
    })
    return serverChat
}

export default createServerConfig
