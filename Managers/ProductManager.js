const fs = require('fs');
const path = require('path');

class ProductManager {
    constructor() {
        this.path = path.join(__dirname, '../data/products.json');
    }

    async getProducts() {
        try {
            if (fs.existsSync(this.path)) return [];
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
            return [];
        }
    }

    async getProductsById(pid) {
        const products = await this.getProducts();
        return products.find(prod => prod.id === pid) || null;
    }

    async addProduct({title, description, code, price, status = true, stock, category, thumbnails = []}) {
        try{
        const products = await this.getProducts();
        const id = products.length ? products[products.length - 1].id + 1 : 1;
        const newProduct = {id, title, description, code, price, status, stock, category, thumbnails};
        products.push(newProduct);
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
        return newProduct;
        } catch (error) {
            console.error('Error al agregar el producto:', error);
        }
    }

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