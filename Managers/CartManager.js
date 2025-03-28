const fs = require('fs');
const path = require('path');

class CartManager {
    constructor() {
        this.path = path.join(__dirname, '../data/carts.json');
    }

    async getCarts() {
        try {
            if (fs.existsSync(this.path)) return [];
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error al obtener los carritos:', error);
            return [];
        }
    }

    async getCartsById(cid) {
        const carts = await this.getCarts();
        return carts.find(cart => cart.id === cid) || null;
    }

    async createCart() {
        try {
            const carts = await this.getCarts();
            const id = carts.length ? carts[carts.length - 1].id + 1 : 1;
            const newCart = {id, products: []};
            carts.push(newCart);
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2))
            return newCart;
        } catch (error) {
            console.error('Error al crear el carrito:', error);
        }
    }

    async addProductToCart(cid, pid) {
        try { 
            let carts = await this.getCarts();
            const cartIndex = carts.findIndex(cart => cart.id === cid);
            if (cartIndex === -1) return null;

            const cart = carts[cartIndex];
            const productIndex = cart.products.findIndex(p => p.product === pid);

            if (productIndex !== -1) {
                cart.products[productIndex].quantity += 1;
            } else {
                cart.products.push({product:pid, quantity:1});
            }
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
            return cart;
        } catch (error) {
            console.error('Error al agregar el producto al carrito:', error);
        }    
    }

}

module.exports = CartManager;