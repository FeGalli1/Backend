import { Faker, es , en } from '@faker-js/faker';
const fakerEN = new Faker({ locale: [en] });
 const faker = new Faker({ locale: [es] });

 const generateMockProduct = () => {
  return {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    photo: faker.image.url,
    price: parseFloat(faker.commerce.price()),
    category: faker.commerce.department(),
    description: fakerEN.commerce.productDescription(),
    stock: fakerEN.datatype.number({ min: 1, max: 100 }),
  };
};

// Función para generar un array de productos simulados
const generateMockProducts = (quantity) => {
  const mockProducts = [];
  for (let i = 0; i < quantity; i++) {
    mockProducts.push(generateMockProduct());
  }
  return mockProducts;
};

export const mockingProductsEndpoint = (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const quantity =100;
    const mockProducts = generateMockProducts(quantity);  // Ajusta si generateMockProducts recibe algún parámetro

    // Puedes seguir con el resto de tu lógica para paginación y renderizado de la vista
    const totalProducts = mockProducts.length;
    const totalPages = Math.ceil(totalProducts / limit);

    const prevLink = page > 1 ? `/mockingproducts?page=${page - 1}&limit=${limit}` : null;
    const nextLink = page < totalPages ? `/mockingproducts?page=${page + 1}&limit=${limit}` : null;

    res.render('products', { products: mockProducts, prevLink, nextLink, user: req.session.user });
} catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener la lista de productos simulados');
}
};
