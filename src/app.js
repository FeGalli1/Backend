import server from "./server.js";

server.listen(3000, () => console.log( ' server is running'))

// import express from 'express';
// import { engine } from 'express-handlebars';

// import http from 'http';
// import { Server } from "socket.io";

// const productManager = new ProductManager("./src/json/productos.json")
// import  ProductManager  from './class/ProductManager.js';
// import  CartManager  from './class/CartManager.js';

// import { strict } from 'assert';
// const cartManager = new CartManager ('./src/json/carts.json'); // Asegúrate de que la ruta sea correcta

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);

// app.use(express.static('public'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.engine('handlebars', engine({ extname: '.hbs', defaultLayout: "main"}));app.set('view engine', 'handlebars');

// const productsRouter = express.Router();
// const cartsRouter = express.Router();

// app.use('/api/products', productsRouter);
// app.use('/api/carts', cartsRouter);

// // GET /
// productsRouter.get('/', async (req, res) => {
//     const products = await productManager.getAll();
//     res.status(200).json(products);
// });
// // GET /api/productos/:id
// productsRouter.get('/:id', async (req, res) => {
//     const {id} = req.params;
//     const product = await productManager.getById(id);

//     product
//         ? res.status(200).json(product)
//         : res.status(404).json({error: "Producto no encontrado"});
    
// })

// // POST /api/productos
// productsRouter.post('/', async (req,res) => {
//     const {body} = req;
//     const newProductId = await productManager.save(body);
//     res.status(200).send(`Producto agregado con el ID: ${newProductId}`)
// })

// // PUT /api/productos/:id
// productsRouter.put('/:id', async (req, res) => {
//     const {id} = req.params;
//     const {body} = req;
//     const wasUpdated = await productManager.updateById(id,body);
//     wasUpdated
//         ? res.status(200).send(`El producto de ID: ${id} fue actualizado`)
//         : res.status(404).send(`El producto no fue actualizado porque no se encontró el ID: ${id}`);
// })

// // DELETE /api/productos/:id
// productsRouter.delete('/:id', async (req, res) => {
//     const {id} = req.params;
//     const wasDeleted = await productManager.deleteById(id);
//     wasDeleted 
//         ? res.status(200).send(`El producto de ID: ${id} fue borrado`)
//         : res.status(404).send(`El producto no fue borrado porque no se encontró el ID: ${id}`);
// })

// cartsRouter.get('/:cid', async (req, res) => {
//     const { cid } = req.params;
//     const cart = await cartManager.getById(cid);
  
//     cart
//       ? res.status(200).json(cart)
//       : res.status(404).json({ error: 'Carrito no encontrado' });
//   });
  
//   // POST /api/carts/:cid/product/:pid
//   cartsRouter.post('/:cid/product/:pid', async (req, res) => {
//     const { cid, pid } = req.params;
//     const { quantity } = req.body;
//     const wasAdded = await cartManager.addItemToCart(cid, pid, quantity);
  
//     wasAdded
//       ? res.status(200).send(`Producto agregado al carrito con ID: ${cid}`)
//       : res.status(404).send('No se pudo agregar el producto al carrito');
//   });


//   const PORT = 8080;
//   server.listen(PORT, () => {
//     console.log(` >>>>> 🚀 Server started at http://localhost:${PORT}`);
//   });
  
//   io.on('connection', (socket) => {
//     // Envía los datos de productos al cliente cuando se conecta
//     socket.emit('products', products);
  
//     // Escucha un nuevo producto y actualiza la lista de productos
//     socket.on('nuevoProducto', (nuevoProducto) => {
//       // Agrega el nuevo producto a la lista de productos
//       products.push(nuevoProducto);
  
//       // Emite la lista actualizada de productos a todos los clientes
//       io.emit('products', products);
//     });
//   });