import { Router } from 'express';
import passport from 'passport';
import { User } from '../models/UserModel.js';
import { isValidPassword } from '../utils/helpers.js';

const routerLog = Router();

routerLog.get('/login', (req, res) => {
    // Renderiza la vista de login
    res.render('login');
});
routerLog.get('/register', (req, res) => {
    // Renderiza la vista de registro
    res.render('register');
});



//  implmentacion del hash en user y contrasena 
routerLog.post('/register',async(req,res)=>{
    const {  email, password} = req.body;
    const exists = await User.findOne({email});
    if(exists) return res.status(400).send({status:"error",error:"User already exists"});
    const user = {
        email,
        password: createHash(password)
    }
    let result = await User.create(user);
    res.send({status:"success",message:"User registered"});
})

routerLog.post('/login',async(req,res)=>{
    const {email, password} = req.body;
    console.log(password)
    
    const user = await User.findOne({email}); //Ya que el password no está hasheado, podemos buscarlo directamente
    console.log(user + ' Pase por aqui')
   
    if(!user) return res.status(400).send({status:"error",error:"Incorrect credentials"});

    if(!isValidPassword(user,password)) if(!user) return res.status(403).send({status:"error",error:"Incorrect password"});
    req.session.user= user
    res.redirect('/products')
})

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
