const express = require('express');
const router = express.Router();
const ProductManager = require('../Managers/ProductManager');
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

module.exports = router;