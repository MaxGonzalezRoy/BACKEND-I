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
            return res.status(400).json({ error: "El ID del carrito debe ser un número válido" });
        }

        const cart = await cartManager.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        res.json(cart.products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        const pid = parseInt(req.params.pid);
        const quantity = parseInt(req.body.quantity) || 1;

        if (isNaN(cid) || isNaN(pid)) {
            return res.status(400).json({ error: "ID del carrito y del producto deben ser números válidos" });
        }

        if (isNaN(quantity) || quantity <= 0) {
            return res.status(400).json({ error: "La cantidad debe ser un número positivo" });
        }
        
        const updatedCart = await cartManager.addProductToCart(cid, pid, quantity);
        if (!updatedCart) {
            return res.status(404).json({ error: "No se pudo actualizar el carrito. Verifique los IDs proporcionados." });
        }

        res.json(updatedCart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;