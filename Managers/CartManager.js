const fs = require('fs');
const path = require('path');

class CartManager {
    constructor() {
        this.path = path.join(__dirname, '../data/carts.json');
    }

    async #readFile() {
        try {
            if (!fs.existsSync(this.path)) {
                await this.#writeFile([]);
                return [];
            }
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            throw new Error(`Error leyendo carritos: ${error.message}`);
        }
    }

    async #writeFile(data) {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(data, null, 2));
        } catch (error) {
            throw new Error(`Error guardando carritos: ${error.message}`);
        }
    }
    
    async getCarts() {
        return await this.#readFile();
    }

    async getCartById(cid) {
        const carts = await this.#readFile();
        const cart = carts.find(cart => cart.id === cid);
        if (!cart) throw new Error(`Carrito con ID ${cid} no encontrado`);
        return cart;
    }
    async createCart() {
        const carts = await this.#readFile();
        const id = carts.length > 0 ? Math.max(...carts.map(c => c.id)) + 1 : 1;
        const newCart = { id, products: [] };
        
        carts.push(newCart);
        await this.#writeFile(carts);
        return newCart;
    }
    async addProductToCart(cid, pid) {
        if (isNaN(pid)) throw new Error('ID de producto inválido');
        
        const carts = await this.#readFile();
        const cartIndex = carts.findIndex(cart => cart.id === cid);
        
        if (cartIndex === -1) throw new Error(`Carrito con ID ${cid} no encontrado`);

        const cart = carts[cartIndex];
        const productIndex = cart.products.findIndex(p => p.product === pid);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        await this.#writeFile(carts);
        return cart;
    }
    async deleteProductFromCart(cid, pid) {
        const carts = await this.#readFile();
        const cartIndex = carts.findIndex(cart => cart.id === cid);
        
        if (cartIndex === -1) throw new Error(`Carrito con ID ${cid} no encontrado`);

        const cart = carts[cartIndex];
        const initialLength = cart.products.length;
        cart.products = cart.products.filter(p => p.product !== pid);
        
        if (cart.products.length === initialLength) {
            throw new Error(`Producto con ID ${pid} no encontrado en el carrito`);
        }

        await this.#writeFile(carts);
        return cart;
    }
}

module.exports = CartManager;