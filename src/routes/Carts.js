'use strict'

import { Router } from 'express'
import {
    getCart,
    deleteProductFromCart,
    updateCart,
    updateProductInCart,
    deleteCart,
} from '../controllers/CartsControllers.js' // Sin la extensión .js si ambos archivos están en el mismo directorio

const router = Router()

router.get('/:cid', getCart)
router.delete('/:cid/products/:pid', deleteProductFromCart)
router.put('/:cid', updateCart)
router.put('/:cid/products/:pid', updateProductInCart)
router.delete('/:cid', deleteCart)

export default router
