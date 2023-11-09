'use strict';

import { Product } from "../models/ProductModel.js"; 

export const getProducts = (req, res) => {
    Product.find({}, { __v: 0 }, (err, products) => {
        if (err) {
            return res.status(500).send({
                status: 500,
                message: `Ocurrió un error al procesar la petición: ${err}`
            });
        }
        if (!products) {
            return res.status(404).send({
                status: 404,
                message: 'No existen productos'
            });
        }
        res.status(200).send({
            status: 200,
            message: 'OK',
            data: products
        });
    });
};
export const saveProduct = (req, res) => {
    const product = new Product();
    ;({
        name: product.name,
        photo: product.photo,
        price: product.price,
        category: product.category,
        description: product.description  
    } = req.body);
    console.log(req.body)
    product.save((err, productSave) => {
        if (err) {
            return res.status(500).send({
                status: 500,
                message: `Error al guardar datos: ${err}`
            });
        }
        res.status(200).send({ productSave });
    });
};
