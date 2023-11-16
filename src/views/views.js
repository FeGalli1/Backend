// views/views.js

import { Product } from '../models/ProductModel.js'

export const viewsRouter = async (req, res) => {
    try {
        console.log('entre')
        const { page = 1, limit = 10 } = req.query
        const skip = (page - 1) * limit

        const products = await Product.find().skip(skip).limit(limit)

        const totalProducts = await Product.countDocuments()
        const totalPages = Math.ceil(totalProducts / limit)

        const prevLink = page > 1 ? `/products?page=${page - 1}&limit=${limit}` : null
        const nextLink = page < totalPages ? `/products?page=${page + 1}&limit=${limit}` : null

        res.render('products', { products, prevLink, nextLink })
    } catch (error) {
        console.error(error)
        res.status(500).send('Error al obtener la lista de productos')
    }
}

/*
mport { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ...
import { Product } from './models/ProductModel.js';

server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));
server.get('/products', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const products = await Product.find()
      .skip(skip)
      .limit(limit);

  const totalProducts = await Product.countDocuments();
  const totalPages = Math.ceil(totalProducts / limit);

  const prevLink = page > 1 ? `/products?page=${page - 1}&limit=${limit}` : null;
  const nextLink = page < totalPages ? `/products?page=${page + 1}&limit=${limit}` : null;

 res.render("products",{ products, prevLink, nextLink })
})


*/
