'use strict'

import { Product } from "../models/ProductModel.js" 

export const getProducts = (req, res)=>{
    Product.find({},{__v:0}, (err,products) =>{
        if(err){
            return res.statusCode(500).send({
                status:500,
                message: `ocurrio un error al procesar la peticion${err}`
            })
        }
        if(!products)
        {
            return res.statusCode(404).send({
                status:404,
                message: `no existen productos`
            })
        }
        res.statusCode(200).send({
            status:200,
            message: 'OK',
            data: products
        })
    })

}

export const saveProduct = (req, res) => {
    const product = new Product()
    
    ;({
      name: product.name,
      photo: product.photo,
      price: product.price,
      category: product.category,
      description: product.description  
    } = req.body)


    product.save((err,productSave)=>{
        if(err){
            res.statusCode(500).send({
                status:500,
                message:`Error al guardar datos ${err}`
            })
        }
        res.statusCode("200").send({productSave})
    })
}