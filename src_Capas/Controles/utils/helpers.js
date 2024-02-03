'use strict'

const removeExtensionFilename = filename => filename.split('.').shift()


import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt'

export const createHash = password => bcrypt.hashSync(password,bcrypt.genSaltSync(10)) // register

export const isValidPassword = ( user, password) => bcrypt.compareSync(password,user.password) //  login 

import { v4 as uuidv4 } from 'uuid';
import { Ticket } from '../../Persistencia/models/TicketsModel.js'; // Asegúrate de proporcionar la ruta correcta al modelo Ticket

// Función para generar y verificar un código único
export const generateUniqueCode = async () => {
  let isUnique = false;
  let code;

  // Intenta generar un código único hasta que encuentre uno que no exista en la base de datos
  while (!isUnique) {
    code = uuidv4(); // Genera un código

    // Verifica si el código ya existe en la base de datos
    const existingTicket = await Ticket.findOne({ code });

    // Si no existe, marca la bandera como verdadera
    if (!existingTicket) {
      isUnique = true;
    }
  }

  return code;
};
export const calculateTotalAmount = (productsToPurchase) => {
    let totalAmount = 0;
  
    for (const purchase of productsToPurchase) {
      const productPrice = purchase.product.price;
      const quantity = purchase.quantity;
  
      // Añadir el costo total de este producto al total
      totalAmount += productPrice * quantity;
    }
  
    return totalAmount;
  };




const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export { removeExtensionFilename }
