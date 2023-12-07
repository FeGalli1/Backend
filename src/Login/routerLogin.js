import { Router } from 'express';
import passport from 'passport';
import { registerUser, loginUser, logoutUser } from '../controllers/UserControllers.js';

const routerLog = Router();

routerLog.get('/login', (req, res) => {
    // Renderiza la vista de login
    res.render('login');
});
routerLog.get('/register', (req, res) => {
    // Renderiza la vista de registro
    res.render('register');
});

// Ruta para iniciar sesión con GitHub
routerLog.get('/login/github', passport.authenticate('github', { scope: ['user:email'] }));

// Callback de autenticación de GitHub
routerLog.get('/login/githubcallback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    async(req, res) => {
        const { user, error } = await passport.authenticate('github');

        // Si la autenticación fue exitosa
        if (!error) {
            // Almacena el usuario en la sesión
            req.session.userId = user._id;
            // Redirecciona al usuario a la página de productos
            res.redirect('/products');
        } else {
            // La autenticación falló
            res.redirect('/login');
        }
    }
);

// Resto de las rutas
routerLog.post('/login', loginUser);
routerLog.get('/logout', logoutUser);
routerLog.post('/register', registerUser);

export default routerLog;
