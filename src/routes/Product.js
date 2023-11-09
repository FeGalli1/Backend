'use strict'

import  { Router} from 'express';
import { getProducts, saveProduct } from '../controllers/ProductsControllers.js';

const router = Router()

router.get('/', getProducts)
router.post('/', saveProduct)



export { router }