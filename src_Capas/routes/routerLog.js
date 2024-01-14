import { Router } from 'express';
import * as AuthController from '../Controles/controllers/AuthController.js';
import passport from 'passport';

const routerLog = Router();

routerLog.get('/login', AuthController.renderLogin);
routerLog.get('/register', AuthController.renderRegister);
routerLog.post('/register', AuthController.registerUser);
routerLog.post('/login', AuthController.loginUser,AuthController.handleSuccessfulLogin);


routerLog.post('/restartPassword', AuthController.restartPassword);

routerLog.get('/faillogin', (req, res) => {
    res.send({ error: 'failed' });
});

routerLog.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});


// Ruta para iniciar sesión con GitHub
routerLog.get('/login/github', passport.authenticate('github',{scope:['user: email']}),
async(req,res)=>{
        console.log(scope)
})

routerLog.get('/login/githubcallback' ,passport.authenticate('github', {failureRedirect:'/login' }), async(req,res)=>{
    req.session.user= req.user
    res.redirect('/products')
})

export default routerLog;
