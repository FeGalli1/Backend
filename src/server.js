'use strict';

import express, { json } from 'express';
import swaggerUi, { serve } from 'swagger-ui-express';
import YAML from 'yamljs';
import cors from 'cors';
import { router } from './routes/index.js';
import { renderProductDetails, viewsRouter } from './views/views.js';
import bodyParser from 'body-parser';

import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import routerLog from './Login/routerLogin.js';


import session from 'express-session';
import config from './config.js';
import cookieParser from 'cookie-parser';




const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = express();
const swaggerDocument = YAML.load('./openapi.yml');


server.use(cookieParser())
server.use(
  session({
    secret: config.COOKIEKEY, 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Configuración de la cookie
  })
);

// Agrega body-parser antes de las rutas
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.use(json());
server.use(cors());
server.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
server.use('/api', router);




server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));
server.get('/products', viewsRouter);
server.get('/products/:productId', renderProductDetails);

server.use('/',routerLog)

function gracefulShutdown(message, code) {
  console.log(`ERROR: ${message}: ${code}`);
}

process.on('exit', (code) => gracefulShutdown('about to exit with:', code));


export default server;
