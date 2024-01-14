'use strict'

import { Router } from 'express'
import { requireAdmin } from '../../controles/middleware/adminMiddleware.js';
import { requireAuth } from '../../controles/middleware/authMiddleware.js';
import { getCarts, getSingleCart, removeCart, removeProductFromCart, saveCart, updateProductQuantityInCart, updateWholeCart } from '../../Controles/controllers/cartControllers.js';

const router = Router()

router.post('/',requireAuth, saveCart);
router.get('/',requireAdmin, getCarts);
router.get('/:cid',requireAdmin, getSingleCart)
router.delete('/:cid/products/:pid',requireAuth, removeProductFromCart)
router.put('/:cid', updateWholeCart)
router.put('/:cid/products/:pid',requireAuth, updateProductQuantityInCart)
router.delete('/:cid',requireAuth, removeCart)

export { router }
