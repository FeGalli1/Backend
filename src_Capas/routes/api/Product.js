'use strict'

import { Router } from 'express'
import {
    deleteProductByIdController,
    deleteProductByTestController,
    getProductByIdController,
    getProductsTerminal,
    saveProduct,
    updateProductByIdController,
} from '../../Controles/controllers/ProductsControllers.js'

const router = Router()

router.get('/', getProductsTerminal)
router.post('/', saveProduct)
router.get('/:productId', getProductByIdController)
router.put('/:productId', updateProductByIdController)
router.delete('/:productId', deleteProductByIdController)
router.delete('/', deleteProductByTestController)

export { router }
