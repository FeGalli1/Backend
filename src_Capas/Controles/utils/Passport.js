import passport from 'passport';
import LocalStrategy from 'passport-local';
import { Strategy as GitHubStrategy } from 'passport-github';
import  User  from '../../Persistencia/models/UserModel.js';
import {  isValidPassword } from '../utils/helpers.js';
import { Cart } from '../../persistencia/models/CartsModel.js';
import config from '../../config.js';

const localStrategy = new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email });

            if (!user) {
                return done(null, false, { message: 'Incorrect email.' });
            }

            if (!isValidPassword(user, password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
);

const githubStrategy = new GitHubStrategy(
    {
      clientID: config.ID_CLIENT,
      clientSecret: config.CLIENT_SECRET,
      callbackURL: config.CALLBACKURL,
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ email: profile.emails[0].value });
            if (!user) {
                // Crea un nuevo usuario con un carrito asociado
                const newUser = new User({
                    email: profile.emails[0].value,
                    first_name: profile.displayName,
                });

                // Crea un carrito y asócialo con el usuario
                const cart = await Cart.create({ owner: newUser._id });
                newUser.cart = cart._id;

                // Guarda el usuario y el carrito
                await newUser.save();

                // Ahora 'user' se refiere al usuario recién creado con el carrito asociado
                user = newUser;
                // Hago esto porque no se crea el carrito solo con create, de esta manera logro crear un carrito
            }


            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
);

passport.use(localStrategy);
passport.use(githubStrategy);

// Serialize and Deserialize User for Session Management
passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

export default passport;
