'use strict'

import { Router } from 'express'
import {
    deleteProductByIdController,
    getProductByIdController,
    getProducts,
    saveProduct,
    updateProductByIdController,
} from '../../Controles/controllers/ProductsControllers.js'
import { requireAdmin } from '../../Controles/middleware/adminMiddleware.js'

const router = Router()

router.get('/', requireAdmin, getProducts)
router.post('/', requireAdmin, saveProduct)
router.get('/:productId', getProductByIdController)
router.put('/:productId', updateProductByIdController)
router.delete('/:productId', deleteProductByIdController)

export { router }
