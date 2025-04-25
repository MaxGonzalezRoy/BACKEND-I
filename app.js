import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import productsRouter from './routes/products.router.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Configuración de Handlebars (agregar esto)
app.engine('handlebars', handlebars.engine());
app.set('views', './src/views');
app.set('view engine', 'handlebars');

// ... resto de tus middlewares actuales ...

// Routes (ya lo tienes)
app.use('/', productsRouter);

// WebSocket setup (nuevo)
io.on('connection', (socket) => {
    console.log('Cliente conectado');

    socket.on('addProduct', (product) => {
    // Aquí deberías agregar el producto a tu lista
        io.emit('productAdded', product);
    });

    socket.on('deleteProduct', (productId) => {
    // Aquí deberías eliminar el producto
        io.emit('productDeleted', productId);
    });
});

// Cambiar app.listen por httpServer.listen
const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});