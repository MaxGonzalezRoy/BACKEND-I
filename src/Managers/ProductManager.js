const fs = require('fs').promises;
const path = require('path');

class ProductManager {
    constructor(customPath) {
        this.path = customPath
            ? path.resolve(__dirname, customPath)
            : path.join(__dirname, '../data/products.json');
        this.initializeFile();
    }

    async initializeFile() {
        try {
            await fs.mkdir(path.dirname(this.path), { recursive: true });
            await fs.access(this.path).catch(async () => {
                await fs.writeFile(this.path, JSON.stringify([], null, 2));
            });
        } catch (error) {
            console.error('❌ Error al inicializar archivo de productos:', error.message);
        }
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            throw new Error('Error al leer productos: ' + error.message);
        }
    }

    async getProductById(id) {
        try {
            const products = await this.getProducts();
            const product = products.find(p => p.id === id);
            if (!product) throw new Error(`Producto con ID ${id} no encontrado`);
            return product;
        } catch (error) {
            throw new Error('Error al obtener producto: ' + error.message);
        }
    }

    async addProduct(product) {
        try {
            const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category'];
            for (const field of requiredFields) {
                if (!product[field]) throw new Error(`Falta el campo requerido: ${field}`);
            }

            const products = await this.getProducts();
            if (products.some(p => p.code === product.code)) {
                throw new Error(`Ya existe un producto con el código ${product.code}`);
            }

            const newProduct = {
                ...product,
                id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
                status: product.status !== undefined ? product.status : true,
                thumbnails: product.thumbnails || []
            };

            products.push(newProduct);
            await fs.writeFile(this.path, JSON.stringify(products, null, 2));
            return newProduct;
        } catch (error) {
            throw new Error('Error al agregar producto: ' + error.message);
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            if (updatedFields.id) throw new Error("No se puede modificar el ID");
            const products = await this.getProducts();
            const index = products.findIndex(p => p.id === id);
            if (index === -1) throw new Error(`Producto con ID ${id} no encontrado`);

            products[index] = { ...products[index], ...updatedFields };
            await fs.writeFile(this.path, JSON.stringify(products, null, 2));
            return products[index];
        } catch (error) {
            throw new Error('Error al actualizar producto: ' + error.message);
        }
    }

    async deleteProduct(id) {
        try {
            const products = await this.getProducts();
            const filtered = products.filter(p => p.id !== Number(id));
            if (products.length === filtered.length) {
                throw new Error(`Producto con ID ${id} no encontrado`);
            }

            await fs.writeFile(this.path, JSON.stringify(filtered, null, 2));
            return true;
        } catch (error) {
            throw new Error('Error al eliminar producto: ' + error.message);
        }
    }
}

module.exports = ProductManager;