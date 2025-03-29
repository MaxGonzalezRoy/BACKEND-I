const fs = require('fs');
const path = require('path');

class ProductManager {
    constructor() {
        this.path = path.join(__dirname, '../data/products.json');
    }

    // Método para obtener todos los productos
    async getProducts() {
        try {
            if (!fs.existsSync(this.path)) return [];  // Si no existe el archivo, devuelve un array vacío
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);  // Retorna los productos desde el archivo
        } catch (error) {
            console.error('Error al obtener los productos:', error);
            return [];  // Devuelve un array vacío si hay error
        }
    }

    // Método para obtener un producto por su ID
    async getProductsById(pid) {
        const products = await this.getProducts();
        return products.find(prod => prod.id === pid) || null;
    }

    // Método para agregar un nuevo producto
    async addProduct({title, description, code, price, status = true, stock, category, thumbnails = []}) {
        try {
            const products = await this.getProducts(); // Carga los productos
            const id = products.length ? products[products.length - 1].id + 1 : 1; // Calcula el ID basado en la longitud de los productos
            const newProduct = {id, title, description, code, price, status, stock, category, thumbnails};

            products.push(newProduct); // Agrega el nuevo producto al array de productos
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2)); // Escribe la lista actualizada en el archivo
            return newProduct; // Retorna el nuevo producto agregado
        } catch (error) {
            console.error('Error al agregar el producto:', error);
        }
    }

    // Método para eliminar un producto por su ID
    async deleteProduct(pid) {
        try {
            let products = await this.getProducts();
            const newProducts = products.filter(prod => prod.id !== pid);
            if (products.length === newProducts.length) return null;
            await fs.promises.writeFile(this.path, JSON.stringify(newProducts, null, 2));
            return true;
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    }
}

module.exports = ProductManager;