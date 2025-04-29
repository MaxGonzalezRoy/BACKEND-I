const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { engine } = require('express-handlebars');
const path = require('path');
const cors = require('cors');

const productsRouter = require('./src/routes/products');
const cartsRouter = require('./src/routes/carts');
const ProductManager = require('./src/managers/ProductManager');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const productManager = new ProductManager();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', engine({
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    defaultLayout: 'main',
}));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(cors({
    origin: ['http://localhost:8080'],
}));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', { products });
    } catch (error) {
        res.status(500).send('Error al obtener productos');
    }
});

app.get('/productos', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('products', { products });
    } catch (error) {
        res.status(500).send('Error al obtener productos');
    }
});

app.get('/contacto', (req, res) => {
    res.render('contact');
});

app.get('/cart', (req, res) => {
    res.render('cart');
});

app.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('realTimeProducts', { products });
    } catch (error) {
        res.status(500).send('Error al obtener productos');
    }
});

io.on('connection', async (socket) => {
    console.log('🟢 Nuevo cliente conectado');

    const sendUpdatedProducts = async (toastMessage = null) => {
        try {
            const products = await productManager.getProducts();
            io.emit('products', products);
            if (toastMessage) socket.emit('toast', toastMessage);
        } catch (error) {
            socket.emit('error', error.message);
        }
    };

    try {
        const products = await productManager.getProducts();
        socket.emit('products', products);
    } catch (error) {
        console.error('Error al obtener productos:', error);
    }

    socket.on('new-product', async (data) => {
        try {
            await productManager.addProduct(data);
            await sendUpdatedProducts('✅ Producto agregado con éxito');
        } catch (error) {
            socket.emit('error', error.message);
        }
    });

    socket.on('delete-product', async (id) => {
        try {
            await productManager.deleteProduct(id);
            await sendUpdatedProducts('🗑️ Producto eliminado correctamente');
        } catch (error) {
            socket.emit('error', error.message);
        }
    });

    socket.on('update-product', async (updatedProduct) => {
        try {
            await productManager.updateProduct(updatedProduct.id, updatedProduct);
            await sendUpdatedProducts('✅ Producto actualizado con éxito');
        } catch (error) {
            socket.emit('error', error.message);
        }
    });

});

app.use((err, req, res, next) => {
    console.error('Error details:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message, stack: err.stack });
});

const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`🚀 Servidor activo en http://localhost:${PORT}`);
});

module.exports = app;