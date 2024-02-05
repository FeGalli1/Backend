import passport from 'passport';
import { createHash } from '../utils/helpers.js';
import User from '../../Persistencia/models/UserModel.js';
import { Cart } from '../../persistencia/models/CartsModel.js';
import { createError, errors } from '../../Errores/errorModule.js';

export const renderLogin = (req, res) => {
    res.render('login');
};

export const renderRegister = (req, res) => {
    res.render('register');
};

export const registerUser = async (req, res) => {
    try {
        const { email, password, first_name, last_name, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const errorDetails = createError(errors.USER_ALREADY_EXISTS);
            return res.status(errorDetails.status).send({ status: 'error', error: errorDetails.message });
        }

        let newUser;
        if (role !== undefined) {
            newUser = new User({ email, password: createHash(password), first_name, last_name, role });
        } else {
            newUser = new User({ email, password: createHash(password), first_name, last_name });
        }

        // Solo asigna un carrito si el usuario no es administrador
        if (role !== 'admin') {
            const cart = await Cart.create({ owner: newUser._id });
            newUser.cart = cart._id;
        }

        const savedUser = await newUser.save();

        res.redirect('/login');
    } catch (error) {
        console.error(error);
        const errorDetails = createError(errors.INTERNAL_SERVER_ERROR);
        res.status(errorDetails.status).send({ status: 'error', error: errorDetails.message });
    }
};

export const loginUser = passport.authenticate('local', {
    failureRedirect: '/faillogin',
    failureFlash: true
});

export const handleSuccessfulLogin = async (req, res) => {
    try {
        // Obtiene el carrito asociado al usuario
        const cart = await Cart.findById(req.user.cart);

        // Guarda el carrito obtenido en la sesión del usuario
        req.session.userCart = cart;
        req.session.user = req.user;

        res.redirect('/products');
    } catch (error) {
        console.error(error);
        const errorDetails = createError(errors.INTERNAL_SERVER_ERROR);
        res.status(errorDetails.status).send({ status: 'error', error: errorDetails.message });
    }
};

export const restartPassword = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        const errorDetails = createError(errors.INCOMPLETE_VALUES);
        return res.status(errorDetails.status).send({ status: 'error', error: errorDetails.message });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            const errorDetails = createError(errors.USER_NOT_FOUND);
            return res.status(errorDetails.status).send({ status: 'error', error: errorDetails.message });
        }

        const newHashedPassword = createHash(password);
        await User.updateOne({ _id: user._id }, { $set: { password: newHashedPassword } });

        res.send({ status: 'success', message: 'Contraseña restaurada' });
    } catch (error) {
        console.error(error);
        const errorDetails = createError(errors.INTERNAL_SERVER_ERROR);
        res.status(errorDetails.status).send({ status: 'error', error: errorDetails.message });
    }
};
