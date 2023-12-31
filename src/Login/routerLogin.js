import { Router } from 'express';
import passport from 'passport';
import { createHash, isValidPassword } from '../utils/helpers.js';
import User from '../models/UserModel.js';
import { Cart } from '../models/CartsModel.js';

const routerLog = Router();

routerLog.get('/login', (req, res) => {
    // Renderiza la vista de login
    res.render('login'); 
});
routerLog.get('/register', (req, res) => {
    // Renderiza la vista de registro
    res.render('register');
});



// Implementación del hash en usuario y contraseña 
routerLog.post('/register', async (req, res) => {
    const { email, password, first_name,last_name} = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ status: "error", error: "User already exists" });
        }

        const newUser = new User({ email, password: createHash(password) , first_name , last_name});
        const savedUser = await newUser.save();

        // Crea un nuevo carrito para el usuario
        const cart = await Cart.create({ owner: savedUser._id });

        // Actualiza el campo cart del usuario con la ID del carrito recién creado
        savedUser.cart = cart._id;
        await savedUser.save();

        //res.send({ status: "success", message: "User registered" });
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Internal Server Error" });
    }
});

routerLog.post('/login', passport.authenticate('local', {
    failureRedirect: '/faillogin',
    failureFlash: true
}), async (req, res) => {
    // La autenticación fue exitosa
    // El usuario está disponible en req.user

    // Obtiene el carrito asociado al usuario
    const cart = await Cart.findById(req.user.cart);

    // Guarda el carrito obtenido en la sesión del usuario
    req.session.userCart = cart;
    req.session.user = req.user;

    res.redirect('/products');
});
routerLog.post('/restartPassword',async(req,res)=>{
    const {email,password} = req.body;
    if(!email||!password) return res.status(400).send({status:"error",error:"Incomplete Values"});
    const user = await User.findOne({email});
    if(!user) return res.status(404).send({status:"error",error:"Not user found"});
    const newHashedPassword = createHash(password);
    await User.updateOne({_id:user._id},{$set:{password:newHashedPassword}});
    res.send({status:"success",message:"Contraseña restaurada"}); 
})



// Ruta para iniciar sesión con GitHub
routerLog.get('/login/github', passport.authenticate('github',{scope:['user: email']}),
async(req,res)=>{
        console.log(scope)
})

routerLog.get('/login/githubcallback' ,passport.authenticate('github', {failureRedirect:'/login' }), async(req,res)=>{
    req.session.user= req.user
    res.redirect('/products')
})

routerLog.post('/register', passport.authenticate('register',{
    failureRedirect:'/failregister'
}),  async(req,res)=>{

    res.send({status:"success",message:"User registered"});
})

routerLog.get('/failregister',async(req,res)=>{
    res.send({error:'failed'})
})

routerLog.post('/login', passport.authenticate('login',{
    failureRedirect:'/faillogin'
}),  async(req,res)=>{
    if(!req.user) return res.status(400).send({status:"error",error:"Incomplete Values"});

    req.session.user={
        first_name: req.user.first_name
    }

    res.send({status:"success",payload:req.user});
})

routerLog.get('/faillogin',async(req,res)=>{
    res.send({error:'failed'})
})
routerLog.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
})

export default routerLog;
