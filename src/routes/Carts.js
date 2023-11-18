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

const router = Router()

router.post('/', saveCart);
router.get('/', getCarts);
router.get('/:cid', getCart)
router.delete('/:cid/products/:pid', deleteProductFromCart)
router.put('/:cid', updateCart)
router.put('/:cid/products/:pid', updateProductInCart)
router.delete('/:cid', deleteCart)

export { router }
