const express = require('express');
const ProductManager = require('./Managers/ProductManager');
const CartManager = require('./Managers/CartManager');
const productsRouter = require('./routes/products');

const app = express();
const PORT = 8080;

app.use('/api/products', productsRouter);

app.use(express.json());

const productManager = new ProductManager();
const cartManager = new CartManager();

app.get('/api/products', async (req, res) => {
    const products = await productManager.getProducts();
    res.json(products);
});

app.get('/api/products/:pid', async (req, res) => {
    const {pid} = req.params;
    const product = await productManager.getProductsById(pid);
    if (!product) return res.status(404).json({message: 'Producto no encontrado'});
    res.json(product);
})

app.post('/api/products', async (req, res) => {
    const newProduct = await productManager.addProduct(req.body);
    res.status(201).json(newProduct);
})

app.delete('/api/products/:pid', async (req, res) => {
    const {pid} = req.params;
    const deleted = await productManager.deleteProduct(Number(pid));
    if (!deleted) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado correctamente' });
});

app.post('/api/carts', async (req, res) => {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
});

app.get('/api/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(Number(cid));
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });
    res.json(cart);
});

app.post('/api/carts/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const updatedCart = await cartManager.addProductToCart(Number(cid), Number(pid));
    if (!updatedCart) return res.status(404).json({ message: 'Error al agregar producto al carrito' });
    res.json(updatedCart);
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});