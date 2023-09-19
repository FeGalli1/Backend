
// Verificar si el archivo package.json existe
if (!fs.existsSync('package.json')) {
  // Crear un archivo package.json vacío
  fs.writeFileSync('package.json', '{}');
  console.log('Created package.json');
} else {
  console.log('package.json already exists');
}


class ProductManage{
    constructor(){
        this.productos=[];
        this.Ids=1;
    }

    getProducts = () =>{
        return this.productos;
    }

    addProduct = (title, description, price, thumbnail, code, stock) => {
        if (title && description && price && thumbnail && code && stock) {
                
            const estaDuplicado = this.productos.some((producto) => producto.code === code);

            if (!estaDuplicado) {
                this.productos.push({ id:this.Ids,title, description, price, thumbnail, code, stock });
                this.Ids++;
            }else{
                console.error("El codigo esta en uso, pruebe con uno distinto");
            }
        }else{
            console.error("Una caracteristica del producto no fue agregada correctamente");
        }
    }

    getProductById = (id) => {
        const product = this.productos.find((producto) => producto.id === id);
        if(product)
        {
            return product;
        }else{
            return "Not found";
        }
    }

}


/*  TE DEJO LOS COMANDO DE PRUEBA QUE YO REALICE */
//const productmanager= new ProductManage();
//console.log(productmanager.getProducts());
//productmanager.addProduct("Prueba","Este es un producto prueba",32,"no imagen",129839,2);
//console.log(productmanager.getProducts());
//productmanager.addProduct("Prueba1","Este tambien es un producto prueba",62,"no imagen",129838,4);
//console.log(productmanager.getProducts());
//console.log(productmanager.getProductById(3));