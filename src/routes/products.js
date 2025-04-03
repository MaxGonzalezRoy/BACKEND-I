const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const products = await productManager.getProducts();
        res.json(limit ? products.slice(0, limit) : products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        if (isNaN(pid)) return res.status(400).json({ error: "ID must be a number" });

        const product = await productManager.getProductById(pid);
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        if (isNaN(pid)) return res.status(400).json({ error: "ID must be a number" });

        const updatedProduct = await productManager.updateProduct(pid, req.body);
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        if (isNaN(pid)) return res.status(400).json({ error: "ID must be a number" });

        await productManager.deleteProduct(pid);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = router;