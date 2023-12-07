import { User } from '../models/UserModel.js';
import bcrypt from 'bcrypt';

export const getUserById = async (userId) => {
    try {
        // Busca el usuario por su ID en la base de datos
        const user = await User.findById(userId);

        return user; // Devuelve el usuario encontrado o null si no existe
    } catch (error) {
        console.error(error);
        throw new Error('Error al obtener el usuario por ID');
    }
};

export const registerUser = async (req, res) => {
    try {
        // Obtén los datos del formulario de registro
        const { email, password } = req.body;

        // Verifica si ya existe un usuario con el mismo correo
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                status: 'error',
                message: 'Ya existe un usuario con este correo electrónico.',
            });
        }

        // Crea un nuevo usuario
        const newUser = new User({ email, role: 'usuario' });

        // Genera el hash de la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Almacena la contraseña con hash en el usuario
        newUser.password = hashedPassword;

        // Guarda el usuario en la base de datos
        await newUser.save();

        // Crea una sesión y almacena el ID del usuario
        req.session.userId = newUser._id;

        // Redirecciona a la vista de productos después del registro
        res.redirect('/products');
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Error al registrar el usuario.',
        });
    }
};
export const loginUser = async (req, res) => {
    try {
        // Obtén los datos del formulario de inicio de sesión 
        const { email, password } = req.body;


        const user = await User.findOne({ email });
        // Verifica si el usuario existe y la contraseña es válida
        if (user && (await user.comparePassword(password))) {
            // Almacena el ID del usuario en la sesión
            req.session.userId = user._id;

            // Si el usuario no es admin, asigna el rol 'usuario'
            if (user.role !== 'admin') {
                user.role = 'usuario';
                await user.save();
            }

            // Redirecciona a la vista de productos después del login
            res.redirect('/products');
        } else {
            res.status(401).json({
                status: 'error',
                message: 'Correo electrónico o contraseña incorrectos.',
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Error al iniciar sesión.',
        });
    }
};


export const logoutUser = async (req, res) => {
    try {
        // Destruye la sesión
        req.session.destroy();

        // Redirecciona a la vista de login después del logout
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Error al cerrar sesión.',
        });
    }
};
export const loginUserGitHub = async (req, res,email) => {
    try {
        const user = await User.findOne({ email });
        // Verifica si el usuario existe y la contraseña es válida
        if (user) {
            // Almacena el ID del usuario en la sesión
            req.session.userId = user._id;

            // Si el usuario no es admin, asigna el rol 'usuario'
            if (user.role !== 'admin') {
                user.role = 'usuario';
                await user.save();
            }

            // Redirecciona a la vista de productos después del login
            res.redirect('/products');
        } else {
            res.status(401).json({
                status: 'error',
                message: 'Correo electrónico o contraseña incorrectos.',
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Error al iniciar sesión.',
        });
    }
};