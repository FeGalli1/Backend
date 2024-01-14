import passport from 'passport';
import { createHash } from '../utils/helpers.js';
import User from '../../persistencia/models/UserModel.js';
import { Cart } from '../../persistencia/models/CartsModel.js';

export const renderLogin = (req, res) => {
    res.render('login');
};

export const renderRegister = (req, res) => {
    res.render('register');
};

export const registerUser = async (req, res) => {
    try {
        const { email, password, first_name, last_name } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ status: "error", error: "User already exists" });
        }

        const newUser = new User({ email, password: createHash(password), first_name, last_name });
        const savedUser = await newUser.save();

        // Crea un nuevo carrito para el usuario
        const cart = await Cart.create({ owner: savedUser._id });

        // Actualiza el campo cart del usuario con la ID del carrito recién creado
        savedUser.cart = cart._id;
        await savedUser.save();

        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Internal Server Error" });
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
        res.status(500).send('Error al procesar la autenticación exitosa');
    }
};
export const restartPassword = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ status: "error", error: "Incomplete Values" });

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).send({ status: "error", error: "Not user found" });

        const newHashedPassword = createHash(password);
        await User.updateOne({ _id: user._id }, { $set: { password: newHashedPassword } });

        res.send({ status: "success", message: "Contraseña restaurada" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Internal Server Error" });
    }
};
