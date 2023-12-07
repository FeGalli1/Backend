'use strict';

import express from 'express';
import swaggerUi, { serve } from 'swagger-ui-express';
import YAML from 'yamljs';
import cors from 'cors';
import { router } from './routes/index.js';
import { renderProductDetails, viewsRouter } from './views/views.js';
import bodyParser from 'body-parser';
import session from 'express-session';
import config from './config.js';
import cookieParser from 'cookie-parser';
import routerLog from './Login/routerLogin.js';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import MongoStore from 'connect-mongo';

import passport from 'passport';
// import LocalStrategy from 'passport-local';
// import GitHubStrategy from 'passport-github2'; // Asegúrate de tener instalado el paquete passport-github2
// import { User } from './models/UserModel.js';

import bcrypt from 'bcrypt'
import initializedPassport from './PassportConfig/Passport.js';


const server = express();
const swaggerDocument = YAML.load('./openapi.yml');

server.use(cookieParser());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

// Configuración de la sesión

server.use(session({
    store:new MongoStore({
        mongoUrl: config.MONGODB_ATLAS_CONNECTION_STRING,
        ttl:3600
    }),
    secret:config.COOKIEKEY,
    resave:false,
    saveUninitialized:false
}))
initializedPassport()
server.use(passport.initialize())
server.use(passport.session())

server.use(cors());
server.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
server.use('/api', router);


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));

server.get('/products', viewsRouter);
server.get('/products/:productId', renderProductDetails);

// Rutas de login
server.use('/', routerLog);

// Manejo de errores global
server.use((err, req, res, next) => {
    console.error(`Error: ${err.message}`);
    console.error(err.stack);
    res.status(500).send('Error interno del servidor');
});

export default server;