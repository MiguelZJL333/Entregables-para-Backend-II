import productRepository from '../repositories/product.repository.js';

/**
 * Service para lógica de negocio de Productos
 */
export class ProductService {

    async getProducts(query = {}, options = { limit: 10, page: 1 }) {
        return await productRepository.findAll(query, options);
    }

    async getProductById(id) {
        const product = await productRepository.findById(id);
        if (!product) throw new Error('Producto no encontrado');
        return product;
    }

    async createProduct(productData) {
        // Validación básica
        if (!productData.title || !productData.description || !productData.code || !productData.price || !productData.stock) {
            throw new Error('Faltan datos requeridos del producto');
        }

        // Verificar que el código sea único
        const existingProduct = await productRepository.findByCode(productData.code);
        if (existingProduct) throw new Error('El código del producto ya existe');

        return await productRepository.create(productData);
    }

    async updateProduct(id, updateData) {
        const product = await this.getProductById(id);

        // No permitir cambio de código si ya existe otro producto con ese código
        if (updateData.code && updateData.code !== product.code) {
            const existingProduct = await productRepository.findByCode(updateData.code);
            if (existingProduct) throw new Error('El código del producto ya existe');
        }

        return await productRepository.update(id, updateData);
    }

    async deleteProduct(id) {
        await this.getProductById(id);
        return await productRepository.delete(id);
    }

    async checkStock(productId, quantity) {
        const product = await this.getProductById(productId);
        
        return {
            available: product.stock >= quantity,
            requested: quantity,
            inStock: product.stock,
            canPurchase: Math.min(quantity, product.stock)
        };
    }

    async decreaseStock(productId, quantity) {
        const product = await this.getProductById(productId);
        
        if (product.stock < quantity) {
            throw new Error(`Stock insuficiente. Disponible: ${product.stock}, solicitado: ${quantity}`);
        }

        return await productRepository.decreaseStock(productId, quantity);
    }
}

export default new ProductService();
