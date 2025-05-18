import { Router } from 'express';
import { productDao, cartDao } from '../dao/index.js';

const viewsRouter = Router();

viewsRouter.get('/', (req, res) => {
    res.render('home');
});

viewsRouter.get('/home', async (req, res) => {
    const result = await productDao.getPaginatedProducts({ page: 1, limit: 100 });
    const products = result.docs;
    res.render('home', { products });
});

viewsRouter.get('/products', async (req, res) => {
    try {
        const { page = 1, limit = 10, category, sort } = req.query;

        const result = await productDao.getPaginatedProducts({
            page: parseInt(page),
            limit: parseInt(limit),
            category,
            sort
        });

        result.queryString = new URLSearchParams({
            ...(category && { category }),
            ...(sort && { sort }),
        }).toString();

        res.render('products', {
            title: 'Productos',
            style: 'products.css',
            products: result
            });
    } catch (error) {
        console.error('❌ Error al obtener productos paginados:', error);
        res.status(500).send('Error interno del servidor');
    }
});

viewsRouter.get('/products-dynamic', (req, res) => {
    res.render('products-dynamic');
});

viewsRouter.get('/cart', (req, res) => {
    res.render('carts');
});

viewsRouter.get('/carts/:cid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await cartDao.getCartById(cid);

        if (!cart) {
            return res.render('error', { message: 'Carrito no encontrado' });
        }

        const enrichedProducts = await Promise.all(
            cart.products.map(async (item) => {
                const product = await productDao.getProductById(item.product._id || item.product);
                return {
                    id: item.product._id || item.product,
                    name: product?.title || 'Producto no disponible',
                    price: product?.price || 0,
                    quantity: item.quantity
                };
            })
        );

        const totalPrice = enrichedProducts.reduce(
        (total, item) => total + (item.price * item.quantity), 0
        );

    res.render('carts', {
        layout: 'main',
        cart: {
            id: cart._id || cart.id,
            products: enrichedProducts,
            totalPrice: totalPrice.toFixed(2)
        }
    });
    } catch (error) {
    console.error('❌ Error al obtener carrito:', error);
    res.status(500).send('Error interno del servidor');
    }
});

export default viewsRouter;