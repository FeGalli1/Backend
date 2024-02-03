'use strict';

import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import cors from 'cors';
import { router } from './api/index.js';
import { renderProductDetails, viewsRouter } from '../visualizacion/views/views.js';
import bodyParser from 'body-parser';
import session from 'express-session';
import config from '../config.js';
import cookieParser from 'cookie-parser';
import routerLog from './routerLog.js';
import { fileURLToPath } from 'url';
import path, { dirname, join } from 'path';
import MongoStore from 'connect-mongo';

import passport from 'passport';
import '../Controles/utils/Passport.js';  // Asegúrate de que estás importando tu archivo passport.js correctamente
import adminRouter from './admin.js';




const server = express();
const swaggerDocument = YAML.load('./openapi.yml');

server.use(cookieParser());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

// Configuración de la sesión
const sessionOptions = {
    secret: config.COOKIEKEY,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongoUrl: config.MONGODB_ATLAS_CONNECTION_STRING, ttl:3600}),
    cookie: { maxAge: 3600000 }, // 1 hour
};
server.use(session(sessionOptions));

server.use(passport.initialize())
server.use(passport.session())

server.use(cors());
server.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
server.use('/api', router);


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, '../Visualizacion/views'));

server.get('/products',notAdmin ,viewsRouter); 
server.get('/products/:productId',notAdmin ,renderProductDetails);


// RUTA DE ADMINISTRADOR

server.use('/admin', adminRouter);

// Rutas de login
server.use('/', routerLog);

// Manejo de errores global
server.use((err, req, res, next) => {
    console.error(`Error: ${err.message}`);
    console.error(err.stack);
    res.status(500).send('Error interno del servidor');
});


/////////////// CHAT CON WEB SOCKET //////////////////
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { setTimeout } from 'timers';
import { isUser, notAdmin } from '../Controles/middleware/authMiddleware.js';

const serverChat = createServer(server);
const io = new Server(serverChat);
server.get('/chat/mensaje', (req, res) => {
    res.render('chat-user.ejs');
});

const anonymousChats = new Map();


io.on('connection', (socket) => {
  let messageHistory = [];
  io.emit('mensaje', "hola mundo");

      // En el lado del servidor, deberías manejar el mensajePrivado así:
    socket.on('mensajePrivado', (data) => {
    console.log("LLEgo")
    const destinatario = data.destinatario;
    const mensaje = data.mensaje;

    // Aquí puedes usar socket.to(destinatario).emit para enviar el mensaje al destinatario específico
    io.to(destinatario).emit('mensaje',mensaje);
    });
  socket.on('user message', (msg) => {
      messageHistory.push({ sender: socket.id, message: msg });
      io.to(socket.id).emit('chat message', msg);

      anonymousChats.set(socket.id, {
          socketId: socket.id,
          lastMessage: msg,
          messageHistory: messageHistory
      });
      io.emit('new message', Array.from(anonymousChats.values()));
  });

  // Manejar desconexión
  socket.on('disconnect', () => {
      anonymousChats.delete(socket.id);
      io.emit('new message', Array.from(anonymousChats.values()));
  });
});
const primerEnvio = () => {
    setTimeout(() => {
        io.emit('new message', Array.from(anonymousChats.values()));
    }, 2000);

}
// Dentro de tu lógica del servidor
server.get('/admin/chat/message', async (req, res) => {
    res.render('chat-admin');
    //le tuve que poner un timeOut porque se enviaba antes de cargar la pagina y generaba problemas
    primerEnvio();
});



export default serverChat;