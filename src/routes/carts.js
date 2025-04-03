const express = require('express');
const router = express.Router();
const CartManager = require('../managers/CartManager');
const cartManager = new CartManager();

router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        if (isNaN(cid)) {
            return res.status(400).json({ error: "ID must be a number" });
        }
        const cart = await cartManager.getCartById(cid);
        res.json(cart.products);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        const pid = parseInt(req.params.pid);
        const quantity = req.body.quantity || 1;

        if (isNaN(cid) || isNaN(pid)) {
            return res.status(400).json({ error: "IDs must be numbers" });
        }

        const updatedCart = await cartManager.addProductToCart(cid, pid, quantity);
        res.json(updatedCart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;