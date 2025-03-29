const fs = require('fs');
const path = require('path');

class CartManager {
    constructor() {
        this.path = path.join(__dirname, '../data/carts.json');
    }

    // Método para obtener todos los carritos
    async getCarts() {
        try {
            if (!fs.existsSync(this.path)) return []; // Si no existe el archivo, devuelve un array vacío
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);  // Retorna los carritos desde el archivo
        } catch (error) {
            console.error('Error al obtener los carritos:', error);
            return [];  // Devuelve un array vacío si hay error
        }
    }

    // Método para obtener un carrito por su ID
    async getCartsById(cid) {
        const carts = await this.getCarts();
        return carts.find(cart => cart.id === cid) || null;
    }

    // Método para crear un nuevo carrito
    async createCart() {
        try {
            const carts = await this.getCarts();
            const id = carts.length ? carts[carts.length - 1].id + 1 : 1;
            const newCart = {id, products: []};
            carts.push(newCart);
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));  // Actualiza el archivo con el nuevo carrito
            return newCart;  // Retorna el carrito creado
        } catch (error) {
            console.error('Error al crear el carrito:', error);
        }
    }

    // Método para agregar un producto a un carrito
    async addProductToCart(cid, pid) {
        try {
            let carts = await this.getCarts();  // Obtiene todos los carritos
            const cartIndex = carts.findIndex(cart => cart.id === cid);  // Busca el carrito por ID
            if (cartIndex === -1) return null;  // Si el carrito no existe, retorna null

            const cart = carts[cartIndex];  // Obtiene el carrito encontrado
            const productIndex = cart.products.findIndex(p => p.product === pid);  // Busca el producto en el carrito

            if (productIndex !== -1) {
                // Si el producto ya está en el carrito, solo aumenta la cantidad
                cart.products[productIndex].quantity += 1;
            } else {
                // Si el producto no está en el carrito, lo agrega con cantidad 1
                cart.products.push({product: pid, quantity: 1});
            }

            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));  // Actualiza el archivo con el carrito modificado
            return cart;  // Retorna el carrito actualizado
        } catch (error) {
            console.error('Error al agregar el producto al carrito:', error);
        }
    }
}

module.exports = CartManager;