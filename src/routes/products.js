import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = Router();
const productManager = new ProductManager(path.join(__dirname, '../data/products.json'));

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', {
            title: 'Todos los Productos',
            products
        });
    } catch (error) {
        res.status(500).render('error', {
            title: 'Error',
            message: 'No se pudieron cargar los productos'
        });
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('realTimeProducts', {
            title: 'Productos en Tiempo Real',
            products,
            script: 'realtime'
        });
    } catch (error) {
        res.status(500).render('error', {
            title: 'Error',
            message: 'No se pudo cargar la vista en tiempo real'
        });
    }
});

export default router;