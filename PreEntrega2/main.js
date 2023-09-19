const ProductManager = require("./ProductManager");

const productManager = new ProductManager("productos.json");

const main = async () => {
  const initialProducts = await productManager.getProducts();
  console.log('Productos Iniciales:', initialProducts);

  const productToAdd = {
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25
  };
  const productToAdd2 = {
    title: "otro producto prueba",
    description: "Este es un producto prueba nuevo",
    price: 660,
    thumbnail: "Sin imagen",
    code: "abc133",
    stock: 59
  };

  const addedProductId = await productManager.addProduct(productToAdd);
  if (addedProductId !== null) console.log('ID del producto agregado:', addedProductId);
  const addedProductId2 = await productManager.addProduct(productToAdd2);
  if (addedProductId2 !== null) console.log('ID del producto agregado:', addedProductId2);

  const updatedProduct = {
    title: "Producto Actualizado",
    description: "Descripción actualizada",
    stock: 3,
    price: 150
  };
  const updatedProductResult = await productManager.updateProduct(addedProductId, updatedProduct);
  if (updatedProductResult !== undefined) console.log('Producto Actualizado:', updatedProductResult);

  const productsAfterUpdate = await productManager.getProducts();
  //si no se actualizo ningun producto devolvera que no hay productos para actualizar
  console.log(productsAfterUpdate.length > 0 ? 'Productos Actualizados:' : 'No hay ningún producto que actualizar');

  try {
    const productById = await productManager.getProductById(addedProductId);
    if (productById !== undefined) console.log('Producto buscado por ID:', productById);
  } catch (error) {
    console.log(error.message);
  }

  await productManager.deleteProduct(addedProductId);

  const productsAfterDelete = await productManager.getProducts();
  console.log('Productos despues de eliminarse:', productsAfterDelete);
};

main();
