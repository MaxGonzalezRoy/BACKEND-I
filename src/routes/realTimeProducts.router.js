import { Router } from 'express';
import ProductManager from '../dao/fileManagers/product.Manager';

const router = Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { products });
});

export default router;