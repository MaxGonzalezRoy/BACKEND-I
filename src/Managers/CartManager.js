const fs = require('fs');
const path = require('path');

class CartManager {
    constructor() {
        this.path = path.join(__dirname, '../data/carts.json');
    }

    #validateId(id) {
        if (isNaN(id)) throw new Error('ID debe ser un número');
        if (id <= 0) throw new Error('ID debe ser positivo');
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

    async #findCartIndex(cid) {
        this.#validateId(cid);
        const carts = await this.#readFile();
        const index = carts.findIndex(cart => cart.id === cid);
        if (index === -1) throw new Error(`Carrito con ID ${cid} no encontrado`);
        return { carts, index };
    }

    async getCarts() {
        return await this.#readFile();
    }

    async getCartById(cid) {
        const { carts, index } = await this.#findCartIndex(cid);
        return carts[index];
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
        this.#validateId(pid);
        const { carts, index } = await this.#findCartIndex(cid);
        
        const productIndex = carts[index].products.findIndex(p => p.product === pid);
        if (productIndex !== -1) {
            carts[index].products[productIndex].quantity += 1;
        } else {
            carts[index].products.push({ product: pid, quantity: 1 });
        }

        await this.#writeFile(carts);
        return carts[index];
    }

    async deleteProductFromCart(cid, pid) {
        this.#validateId(pid);
        const { carts, index } = await this.#findCartIndex(cid);
        
        const initialLength = carts[index].products.length;
        carts[index].products = carts[index].products.filter(p => p.product !== pid);
        
        if (carts[index].products.length === initialLength) {
            throw new Error(`Producto con ID ${pid} no encontrado en el carrito`);
        }

        await this.#writeFile(carts);
        return carts[index];
    }
}

module.exports = CartManager;