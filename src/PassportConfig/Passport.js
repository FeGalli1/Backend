import passport from 'passport'
import local from 'passport-local'

import { createHash,isValidPassword } from '../utils/helpers.js'

import  GitHubStrategy  from 'passport-github2'
import { User } from '../models/UserModel.js'


const LocalStrategy = local.Strategy;



const initializedPassport = () =>{
   
      
  passport.use('github', new GitHubStrategy({
    clientID: 'Iv1.8e26441660c9e03f',
    clientSecret: 'f0c130709520615ea8b6ddd9ec959a31273f8439',
    callbackURL: 'http://localhost:3001/login/githubcallback',
 }, async ( accesToken , refreshToekn,profile, done) => {
    try {
      // Verificar la identidad del usuario
      let user = await User.findOne({ email: profile._json.email });
  
      // Buscar o crear un usuario en la base de datos
      if (!user) {
        const newUser = {
          email: profile._json.email,
          password: createHash(profile._json.email), // Genera un hash seguro de la email
        };
        let result = await User.create(newUser);
        done(null,result)
      } else {
        done(null, false, { message: 'El usuario ya existe.' });
      }
    } catch (error) {
        done(error);
    }
 }));
      
 
    passport.use('register', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' },
    async (req, password, done) => {
      const { email } = req.body;
  
      try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return done(null, false, { message: 'Correo electrónico ya en uso.' });
        }
  
        const newUser = {
          email,
          password: createHash(password),
        };
        const createdUser = await User.create(newUser);
        return done(null, createdUser);
      } catch (error) {
        return done('Error al registrar el usuario.', error);
      }
    }
  ));
  

    passport.use('login', new LocalStrategy( {passReqToCallback :true , usernameField :'email'},
    async(req,email,password,done)=>{

        try{
            const user = await User.findOne({email:email});
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
        let user = await User.findById(id)
        done(null,user)
    })
}

export default initializedPassport