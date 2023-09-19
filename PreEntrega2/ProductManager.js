const fs = require('fs');


class ProductManager {
  constructor(fileName) {
    this._filename = fileName;
    this._currentId = 1;
    //Chequeamos que exista antes de intentar leerlo
    if (!fs.existsSync(this._filename)) {
      this._createEmptyFile();
      console.log(`Se creó el archivo ${this._filename} porque no existía.`);
    }
    this._readFileOrCreateNewOne();
  }

  async _createEmptyFile() {
    await fs.promises.writeFile(this._filename, '[]', 'utf-8');
  }
  async _readFileOrCreateNewOne() {
    try {
      const data = await fs.promises.readFile(this._filename, 'utf-8');
      const parsedData = JSON.parse(data);
      
      if (parsedData.length > 0) {
        this._currentId = Math.max(...parsedData.map(item => item.id)) + 1;
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        await this._createEmptyFile();
      } else {
        console.log(`Error Code: ${error.code} | There was an unexpected error when trying to read ${this._filename}`);
      }
    }
  }

  async _createEmptyFile() {
    await fs.promises.writeFile(this._filename, '[]', 'utf-8');
  }

  async getProducts() {
    try {
      const allData = await this.getData();
        if (!allData) {
        return [];
      }
  
      return JSON.parse(allData);
    } catch (error) {
      console.log(`Error: Unable to parse JSON data - ${error.message}`);
      return [];
    }
  }

  async getProductById(id) {
    try {
      const data = await this.getData();
      const parsedData = JSON.parse(data);

      const product = parsedData.find(item => item.id === id);
      if (!product) {
        throw new Error('Producto no encontrado');
      }

      return product;
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }

  async updateProduct(id, updatedFields) {
    try {
      const data = await this.getData();
      const parsedData = JSON.parse(data);

      const productIndex = parsedData.findIndex(item => item.id === id);
      if (productIndex === -1) {
        throw new Error('Producto no encontrado');
      }

      parsedData[productIndex] = {
        ...parsedData[productIndex],
        ...updatedFields,
        id
      };

      await fs.promises.writeFile(this._filename, JSON.stringify(parsedData));
      return parsedData[productIndex];
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }

  async deleteProduct(id) {
    try {
      const data = await this.getData();
      const parsedData = JSON.parse(data);

      const updatedData = parsedData.filter(item => item.id !== id);
      if (updatedData.length === parsedData.length) {
        throw new Error('Producto no encontrado');
      }

      await fs.promises.writeFile(this._filename, JSON.stringify(updatedData));
      console.log('Producto eliminado correctamente');
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }

 
async getData() {
  try {
    const data = await fs.promises.readFile(this._filename, 'utf-8');
    return data || '[]';  // Devuelve un array vacío si el archivo está vacío
  } catch (error) {
    console.log(`Error Code: ${error.code} | Se genero un problema intentando leer -> ${this._filename}`);
    return '[]';  // Devuelve un array vacío en caso de error
  }
}

async addProduct(product) {
  try {
    const allData = await this.getData();
    const parsedData = JSON.parse(allData);

    // Verificar si el code ya está en uso
    const isCodeUnique = parsedData.every(item => item.code !== product.code);

    if (!isCodeUnique && product.title && product.description && product.price && product.thumbnail && product.code && product.stock) {
      console.log('El código está en uso, pruebe con uno distinto');
      return null;  // Devolvemos null para indicar que no se pudo agregar el producto
    }

    // Verificar si todos los campos necesarios están presentes
    if (isCodeUnique && product.title && product.description && product.price && product.thumbnail && product.code && product.stock) {
      // Generar un nuevo ID único
      const newId = Math.max(...parsedData.map(item => item.id), 0) + 1;
      product.id = newId;

      parsedData.push(product);

      await fs.promises.writeFile(this._filename, JSON.stringify(parsedData));
      return newId;  // Devuelve el nuevo ID
    } else {
      console.log('El producto no cumple con los parámetros');
      return null;  // Devolvemos null para indicar que no se pudo agregar el producto
    }
  } catch (error) {
    console.log(`Error Code: ${error.code} | Hubo un error al intentar añadir el producto`);
    return null;  // Devolvemos null para indicar que no se pudo agregar el producto
  }
}
}

module.exports = ProductManager;
