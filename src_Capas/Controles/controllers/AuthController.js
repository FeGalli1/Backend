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
        const { email, password, first_name, last_name, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ status: "error", error: "User already exists" });
        }
        let newUser;
        if(role!== undefined)
        {
            newUser = new User({ email, password: createHash(password), first_name, last_name, role });
        }else{
            newUser = new User({ email, password: createHash(password), first_name, last_name});
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
