import { Router } from 'express';
import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import { registerUser, loginUser, logoutUser } from '../controllers/UserControllers.js';

const routerLog = Router();

routerLog.get('/login', (req, res) => {
    // Renderiza la vista de login
    res.render('login');
});

// Ruta para iniciar sesión con GitHub
routerLog.get('/auth/github', passport.authenticate('github'));

// Callback de autenticación de GitHub
routerLog.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/products');
    }
);

// Resto de las rutas
routerLog.post('/login', loginUser);
routerLog.get('/logout', logoutUser);
routerLog.get('/register', (req, res) => {
    // Renderiza la vista de registro
    res.render('register');
});
routerLog.post('/register', registerUser);

routerLog.get('/login/github', passport.authenticate('github',{scope:['user: email']}),
async(req,res)=>{
})

routerLog.get('/login/githubcallback' ,passport.authenticate('github', {failureRedirect:'/login' }), async(req,res)=>{
    req.session.user= req.user
    res.redirect('/products') 
})
export default routerLog;
