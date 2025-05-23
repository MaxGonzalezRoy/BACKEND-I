import fs from 'fs/promises';
import path from 'path';

const filePath = path.resolve('src/data/products.json');

class ProductManager {
  constructor() {
    this.path = filePath;
    this.#initFile();
  }

  async #initFile() {
    try {
      await fs.access(this.path);
      console.log("✅ Archivo existente detectado:", this.path);
    } catch (err) {
      console.warn("⚠️ Archivo no encontrado. Creando nuevo archivo vacío:", this.path);
      await this.#writeFile([]);
    }
  }

  async #readFile() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error("❌ Error leyendo archivo de productos:", err.message);
      return [];
    }
  }

  async #writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  async getPaginatedProducts({ page = 1, limit = 10, category, sort } = {}) {
    const products = await this.#readFile();

    let filtered = category
      ? products.filter(p => p.category.toLowerCase() === category.toLowerCase())
      : [...products];

    if (sort === 'asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'desc') {
      filtered.sort((a, b) => b.price - a.price);
    }

    const totalDocs = filtered.length;
    const totalPages = Math.ceil(totalDocs / limit);
    page = Math.max(1, Math.min(page, totalPages || 1));

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const docs = filtered.slice(startIndex, endIndex).map(p => ({ ...p, _id: p.id }));

    return {
      status: 'success',
      docs,
      totalDocs,
      limit,
      totalPages,
      page,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
    };
  }

  async getProductById(id) {
    const products = await this.#readFile();
    return products.find(p => p.id === id);
  }

  async addProduct(productData) {
    const requiredFields = ['title', 'description', 'price', 'code', 'stock', 'category'];
    for (const field of requiredFields) {
      if (!productData[field]) throw new Error(`Campo requerido faltante: ${field}`);
    }

    const products = await this.#readFile();

    if (products.some(p => p.code === productData.code)) {
      throw new Error('Ya existe un producto con ese código');
    }

    const newProduct = {
      id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
      status: true,
      thumbnails: [],
      ...productData
    };

    products.push(newProduct);
    await this.#writeFile(products);
    return newProduct;
  }

  async updateProduct(id, updateData) {
    const products = await this.#readFile();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Producto no encontrado');

    if ('id' in updateData) delete updateData.id;

    products[index] = { ...products[index], ...updateData };
    await this.#writeFile(products);
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.#readFile();
    const newProducts = products.filter(p => p.id !== id);
    if (products.length === newProducts.length) throw new Error('Producto no encontrado');

    await this.#writeFile(newProducts);
    return true;
  }
}

const productDao = new ProductManager();
export { productDao };