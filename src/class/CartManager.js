import fs from 'fs';

class CartManager {
  constructor(fileName) {
    this._filename = fileName;
    this._readFileOrCreateNewOne();
  }

  async _readFileOrCreateNewOne() {
    try {
      await fs.promises.readFile(this._filename, 'utf-8');
    } catch (error) {
      error.code === 'ENOENT'
        ? this._createEmptyFile()
        : console.log(
            `Error Code: ${error.code} | There was an unexpected error when trying to read ${this._filename}`
          );
    }
  }

  async _createEmptyFile() {
    fs.promises.writeFile(this._filename, '[]', (error) => {
      error
        ? console.log(error)
        : console.log(
            `File ${this._filename} was created since it didn't exist in the system`
          );
    });
  }

  async getById(id) {
    id = Number(id);
    try {
      const data = await this.getData();
      const parsedData = JSON.parse(data);

      return parsedData.find((cart) => cart.id === id);
    } catch (error) {
      console.log(
        `Error Code: ${error.code} | There was an error when trying to get a cart by its ID (${id})`
      );
    }
  }

  async addItemToCart(cartId, productId, quantity) {
    try {
      const data = await this.getData();
      const parsedData = JSON.parse(data);
      const cart = parsedData.find((cart) => cart.id === cartId);

      if (cart) {
        const itemIndex = cart.products.findIndex((item) => item.id === productId);

        if (itemIndex !== -1) {
          cart.products[itemIndex].quantity += quantity;
        } else {
          cart.products.push({ id: productId, quantity });
        }

        await fs.promises.writeFile(this._filename, JSON.stringify(parsedData));
        return true;
      } else {
        console.log(`Cart ID ${cartId} does not exist`);
        return null;
      }
    } catch (error) {
      console.log(
        `Error Code: ${error.code} | There was an error when trying to add an item to the cart (Cart ID: ${cartId}, Product ID: ${productId})`
      );
    }
  }

  async getAll() {
    const data = await this.getData();
    return JSON.parse(data);
  }

  async getData() {
    const data = await fs.promises.readFile(this._filename, 'utf-8');
    return data;
  }
}

export default CartManager;
