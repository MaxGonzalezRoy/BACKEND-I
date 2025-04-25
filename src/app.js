const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { engine } = require('express-handlebars');
const path = require('path');

const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const ProductManager = require('./managers/ProductManager');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const productManager = new ProductManager('./data/products.json');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Handlebars config
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Rutas API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Vista estática con productos
app.get('/home', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('home', { products });
});

// Vista dinámica con WebSockets
app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

// WebSockets
io.on('connection', async (socket) => {
    console.log('🟢 Nuevo cliente conectado');

    // Enviar los productos al nuevo cliente
    let products = await productManager.getProducts();
    socket.emit('products', products);

    // Escuchar cuando se recibe un nuevo producto
    socket.on('new-product', async (data) => {
        await productManager.addProduct(data);
        const updatedProducts = await productManager.getProducts();
        io.emit('products', updatedProducts);
    });

    socket.on('delete-product', async (id) => {
        await productManager.deleteProduct(id);
        const updated = await productManager.getProducts();
        io.emit('products', updated);
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});

module.exports = app;