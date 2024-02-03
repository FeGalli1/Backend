import { Router } from "express";
import {  isUser } from "../../Controles/middleware/authMiddleware.js";



const router = Router()

    router.get('/',isUser,(req, res) => {
            res.render('chat-user');
    });


  
  export { router }
