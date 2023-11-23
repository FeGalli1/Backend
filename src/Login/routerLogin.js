// Importa las funciones necesarias para el manejo de usuarios y sesiones
import { Router } from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/UserControllers.js';


const routerLog = Router()
// Rutas
routerLog.get('/register', (req, res) => {
    // Renderiza la vista de registro
    res.render('register');
});

routerLog.post('/register', registerUser);

routerLog.get('/login', (req, res) => {
    // Renderiza la vista de login
    res.render('login');
});

routerLog.post('/login', loginUser);

routerLog.get('/logout', logoutUser);


export default routerLog