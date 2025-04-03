const fs = require('fs').promises;
const path = require('path');
const ProductManager = require('./ProductManager');
class CartManager {
    constructor() {
        this.path = path.join(__dirname, '../data/carts.json');
        this.initializeFile();
    }

    async initializeFile() {
        try {
            await fs.mkdir(path.dirname(this.path), { recursive: true });
            await fs.access(this.path).catch(async () => {
                await fs.writeFile(this.path, JSON.stringify([], null, 2));
            });
        } catch (error) {
            console.error('Error initializing carts file:', error);
            throw error;
        }
    }

    async createCart() {
        try {
            const carts = await this.getCarts();
            const newCart = {
                id: carts.length > 0 ? Math.max(...carts.map(c => c.id)) + 1 : 1,
                products: []
            };
            carts.push(newCart);
            await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
            return newCart;
        } catch (error) {
            throw new Error('Error creating cart: ' + error.message);
        }
    }

    async getCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            throw new Error('Error reading carts: ' + error.message);
        }
    }

    async getCartById(id) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(c => c.id === id);
            if (!cart) throw new Error(`Cart with ID ${id} not found`);
            return cart;
        } catch (error) {
            throw new Error('Error getting cart: ' + error.message);
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const productManager = new ProductManager();
            await productManager.getProductById(productId);

            const carts = await this.getCarts();
            const cartIndex = carts.findIndex(c => c.id === cartId);
            if (cartIndex === -1) throw new Error(`Cart with ID ${cartId} not found`);

            const productIndex = carts[cartIndex].products.findIndex(
                p => p.product === productId
            );

            if (productIndex !== -1) {
                carts[cartIndex].products[productIndex].quantity += quantity;
            } else {
                carts[cartIndex].products.push({ product: productId, quantity });
            }

            await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
            return carts[cartIndex];
        } catch (error) {
            throw new Error('Error adding product to cart: ' + error.message);
        }
    }
}

module.exports = CartManager;