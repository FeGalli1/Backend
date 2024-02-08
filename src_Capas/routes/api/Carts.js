'use strict'

import { Router } from 'express'
import { requireAdmin } from '../../Controles/middleware/adminMiddleware.js';
import { requireAuth } from '../../Controles/middleware/authMiddleware.js';
import { getCarts, getSingleCart, purchaseCard, removeCart, removeProductFromCart, saveCart, updateProductQuantityInCart, updateWholeCart } from '../../Controles/controllers/cartControllers.js';
import { Ticket } from '../../Persistencia/models/TicketsModel.js';
import { logError } from '../../Errores/Winston.js';

const router = Router()

router.post('/',requireAuth, saveCart);
router.get('/',requireAdmin, getCarts);
router.get('/:cid',requireAdmin, getSingleCart)
router.delete('/:cid/products/:pid',requireAuth, removeProductFromCart)
router.put('/:cid', updateWholeCart)
router.put('/:cid/products/:pid',requireAuth, updateProductQuantityInCart)
router.delete('/:cid',requireAuth, removeCart)


router.post('/:cid/purchase', purchaseCard);


  // Ruta para mostrar detalles del ticket
router.get('/ticket/:ticketID', async (req, res) => {
    try {
      const ticket = await Ticket.findById(req.params.ticketID);
  
      // Renderizar la página con los detalles del ticket
      res.render('ticket-details', { ticket });
    } catch (error) {
      logError(error);
      res.status(500).send('Error al obtener los detalles del ticket.');
    }
  });
  
export { router }
