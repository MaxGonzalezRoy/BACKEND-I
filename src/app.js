const express = require('express');
const router = express.Router();
const ProductManager = require('../src/Managers/ProductManager');
const productManager = new ProductManager();
const app = express();
const producsRouter = require('./routes/products');

app.use('express.json());');
app.use('/api/products', producsRouter);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.json(products);
});

router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    const product = await productManager.getProductsById(pid);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
});

router.post('/', async (req, res) => {
    const newProduct = await productManager.addProduct(req.body);
    res.status(201).json(newProduct);
});

router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    const deleted = await productManager.deleteProduct(Number(pid));
    if (!deleted) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado correctamente' });
});

module.exports = router;