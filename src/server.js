'use strict';

import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import cors from 'cors';
import { router } from './routes/index.js';
import { renderProductDetails, viewsRouter } from './views/views.js';
import bodyParser from 'body-parser';
import session from 'express-session';
import config from './config.js';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import GitHubStrategy from 'passport-github2'; // Asegúrate de tener instalado el paquete passport-github2
import { User } from './models/UserModel.js';
import routerLog from './Login/routerLogin.js';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
 
const server = express();
const swaggerDocument = YAML.load('./openapi.yml');

server.use(cookieParser());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

// Configuración de la sesión
server.use(session({
    secret: config.COOKIEKEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
}));

// Configuración de Passport
server.use(passport.initialize());
server.use(passport.session());

// Configuración de la estrategia local
passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email });

            if (!user) {
                return done(null, false, { message: 'Correo electrónico incorrecto.' });
            }

            if (!(await user.comparePassword(password))) {
                return done(null, false, { message: 'Contraseña incorrecta.' });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

// Configuración de la estrategia de GitHub
passport.use(new GitHubStrategy({
    clientID: 'Iv1.8e26441660c9e03f',
    clientSecret: 'f0c130709520615ea8b6ddd9ec959a31273f8439',
    callbackURL: 'http://localhost:3000/auth/github/callback',
  },
  async ( accesToken , refreshToekn, profile ,done) =>{
      try{
          let user = await userModel.findOne({ email : profile._json.email})
      if(!user){
          let newUser ={
              first_name: profile._json.name,
              last_name: '',
              email: profile._json.email,
              age: '123',
              password:''
          }
          let result = await userModel.create(newUser);
          done(null,result)
      }

      }catch(error){
          done(error)
      }
  }
  ))

  passport.use('register', new LocalStrategy( {passReqToCallback :true , usernameField :'email'},
  async(req,username,password,done)=>{
      const { first_name, last_name, email, age} = req.body;
      try{
          const user = await userModel.findOne({email : username});
          if(user) {
              console.log(user)
          return done(null,false)
          }
          const newUser = {
              first_name,
              last_name,
              email,
              age,
              password: createHash(password)
          }
          let result = await userModel.create(newUser);
          return done(null,result)
      }catch(error){
          return done('User Not fount'+error)
      }
  }
  ))

  passport.use('login', new LocalStrategy( {passReqToCallback :true , usernameField :'email'},
  async(req,email,password,done)=>{

      try{
          const user = await userModel.findOne({email:email});
          console.log ( ' User login ' + user)
          if(!user) {
              return done(null,false)
          }

          if(!isValidPassword(user,password)) {
              return done(null,false)
          }
          
          return done(null,user)
      }catch(error){
          return done(null,false)
      }
  }
  ))


  passport.serializeUser((user,done)=>{
      done(null,user.id)
  })

  passport.deserializeUser(async(id,done)=>{
      let user = await userModel.findById(id)
      done(null,user)
  })



// Serialize y Deserialize del usuario para la sesión
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

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