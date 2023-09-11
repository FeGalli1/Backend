

class ProductManage{
    constructor(){
        this.productos=[
            {
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            }
        ]
    }

    getProducts = () =>{
        return this.productos
    }

    addProducts = (title,description,price,thumbnail,code,stock) => {
        const newproduct = {title,description,price,thumbnail,code,stock}
        return this.productos.push(newproduct)
    }

}

const productmanager= new ProductManage();
console.log(productmanager.getProducts());