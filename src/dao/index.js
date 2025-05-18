const persistence = process.env.PERSISTENCE || 'file';

let productDao;
let cartDao;

if (persistence === 'mongo') {
    console.log("📦 Usando persistencia en MongoDB");
    const ProductDaoMongo = (await import('./mongoManagers/product.dao.js')).default;
    const CartDaoMongo = (await import('./mongoManagers/cart.dao.js')).default;
    productDao = new ProductDaoMongo();
    cartDao = new CartDaoMongo();
} else {
    console.log("📁 Usando persistencia con archivos JSON");

    // Importar las instancias directamente desde los archivos .js
    const productModule = await import('./fileManagers/productManager.js');
    const cartModule = await import('./fileManagers/cartManager.js');

    productDao = productModule.productDao;
    cartDao = cartModule.cartDao;
}

export { productDao, cartDao };