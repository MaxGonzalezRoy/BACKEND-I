const fs = require('fs');
const path = require('path');

class ProductManager {
    constructor() {
        this.path = path.join(__dirname, '../src/data/products.json');
    }

    async #readFile() {
        try {
            if (!fs.existsSync(this.path)) await this.#writeFile([]);
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error leyendo archivo:', error);
            return [];
        }
    }

    async #writeFile(data) {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(data, null, 2), 'utf-8');
        } catch (error) {
            console.error('Error escribiendo archivo:', error);
            throw error;
        }
    }
    async getProducts() {
        return await this.#readFile();
    }
    async getProductById(pid) {
        const products = await this.#readFile();
        const product = products.find(prod => prod.id === pid);
        if (!product) throw new Error(`Producto con ID ${pid} no encontrado`);
        return product;
    }
    async addProduct({ title, description, code, price, status = true, stock, category, thumbnails = [] }) {
        if (!title || !description || !code || !price || !stock || !category) {
            throw new Error('Faltan campos obligatorios');
        }

        const products = await this.#readFile();
        
        if (products.some(prod => prod.code === code)) {
            throw new Error(`El código ${code} ya está en uso`);
        }

        const id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        const newProduct = { id, title, description, code, price, status, stock, category, thumbnails };

        products.push(newProduct);
        await this.#writeFile(products);
        return newProduct;
    }
    async updateProduct(id, updatedFields) {
        const products = await this.#readFile();
        const index = products.findIndex(p => p.id === id);
        
        if (index === -1) throw new Error(`Producto con ID ${id} no encontrado`);

        if ('id' in updatedFields) delete updatedFields.id;

        const updatedProduct = { ...products[index], ...updatedFields };
        products[index] = updatedProduct;

        await this.#writeFile(products);
        return updatedProduct;
    }
    async deleteProduct(id) {
        const products = await this.#readFile();
        const newProducts = products.filter(prod => prod.id !== id);
        
        if (products.length === newProducts.length) {
            throw new Error(`Producto con ID ${id} no encontrado`);
        }

        await this.#writeFile(newProducts);
        return true;
    }
}

module.exports = ProductManager;