import cartRepository from '../repositories/cart.repository.js';
import productRepository from '../repositories/product.repository.js';

/**
 * Service para lógica de negocio de Carrito
 */
export class CartService {

    async getCart(cartId) {
        const cart = await cartRepository.findById(cartId);
        if (!cart) throw new Error('Carrito no encontrado');
        return cart;
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        // Validar que el producto exista
        const product = await productRepository.findById(productId);
        if (!product) throw new Error('Producto no encontrado');

        // Validar stock disponible
        if (product.stock < quantity) {
            throw new Error(`Stock insuficiente. Disponible: ${product.stock}`);
        }

        return await cartRepository.addProduct(cartId, productId, quantity);
    }

    async removeProductFromCart(cartId, productId) {
        return await cartRepository.removeProduct(cartId, productId);
    }

    async updateProductQuantity(cartId, productId, quantity) {
        if (quantity <= 0) {
            return await this.removeProductFromCart(cartId, productId);
        }

        // Validar stock
        const product = await productRepository.findById(productId);
        if (!product) throw new Error('Producto no encontrado');

        if (product.stock < quantity) {
            throw new Error(`Stock insuficiente. Disponible: ${product.stock}`);
        }

        return await cartRepository.updateProductQuantity(cartId, productId, quantity);
    }

    async clearCart(cartId) {
        return await cartRepository.clear(cartId);
    }

    async getCartTotal(cart) {
        let total = 0;
        
        if (!cart.products || cart.products.length === 0) {
            return total;
        }

        cart.products.forEach(item => {
            if (item.product) {
                total += item.product.price * item.quantity;
            }
        });

        return Number(total.toFixed(2));
    }

    async validateCartProducts(cart) {
        const result = {
            validProducts: [],
            invalidProducts: [],
            total: 0
        };

        if (!cart.products || cart.products.length === 0) {
            return result;
        }

        for (const item of cart.products) {
            const product = await productRepository.findById(item.product._id || item.product);
            
            if (!product) {
                result.invalidProducts.push({
                    productId: item.product._id || item.product,
                    reason: 'Producto no encontrado'
                });
            } else if (product.stock < item.quantity) {
                result.invalidProducts.push({
                    productId: product._id,
                    title: product.title,
                    requestedQuantity: item.quantity,
                    availableStock: product.stock,
                    reason: 'Stock insuficiente'
                });
            } else {
                result.validProducts.push({
                    productId: product._id,
                    title: product.title,
                    quantity: item.quantity,
                    price: product.price,
                    subtotal: product.price * item.quantity
                });
                result.total += product.price * item.quantity;
            }
        }

        result.total = Number(result.total.toFixed(2));
        return result;
    }
}

export default new CartService();
