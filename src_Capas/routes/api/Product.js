'use strict'

import { Router } from 'express'
import { getProducts, saveProduct } from '../../controles/controllers/ProductsControllers.js'
import { requireAdmin } from '../../controles/middleware/adminMiddleware.js';

const router = Router()

router.get('/',requireAdmin, getProducts)
router.post('/',requireAdmin, saveProduct)
// router.get('/:id',getProductsId)
export { router }
