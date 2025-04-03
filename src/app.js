const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

app.get('/', (req, res) => res.send('API Funcionando'));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});