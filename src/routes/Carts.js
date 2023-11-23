'use strict'

import { Router } from 'express'
import {
    saveCart,
    getCart,
    deleteProductFromCart,
    updateCart,
    updateProductInCart,
    deleteCart,
    getCarts
} from '../controllers/CartsControllers.js' 
import { requireAdmin } from '../middleware/adminMiddleware.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router()

router.post('/',requireAuth, saveCart);
router.get('/',requireAdmin, getCarts);
router.get('/:cid',requireAdmin, getCart)
router.delete('/:cid/products/:pid',requireAuth, deleteProductFromCart)
router.put('/:cid',requireAuth, updateCart)
router.put('/:cid/products/:pid',requireAuth, updateProductInCart)
router.delete('/:cid',requireAuth, deleteCart)

export { router }
