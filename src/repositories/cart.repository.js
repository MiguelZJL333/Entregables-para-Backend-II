import CartModel from '../models/cart.model.js';

/**
 * Repository para operaciones de Carrito
 */
export class CartRepository {
    
    async findById(id) {
        return await CartModel.findById(id).populate('products.product');
    }

    async create() {
        const cart = new CartModel({ products: [] });
        return await cart.save();
    }

    async addProduct(cartId, productId, quantity) {
        const cart = await CartModel.findById(cartId);
        
        if (!cart) throw new Error('Carrito no encontrado');

        const existingProduct = cart.products.find(p => p.product.toString() === productId.toString());
        
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        return await cart.save();
    }

    async removeProduct(cartId, productId) {
        return await CartModel.findByIdAndUpdate(
            cartId,
            { $pull: { products: { product: productId } } },
            { new: true }
        ).populate('products.product');
    }

    async updateProductQuantity(cartId, productId, quantity) {
        return await CartModel.findByIdAndUpdate(
            cartId,
            { $set: { 'products.$[elem].quantity': quantity } },
            { arrayFilters: [{ 'elem.product': productId }], new: true }
        ).populate('products.product');
    }

    async clear(cartId) {
        return await CartModel.findByIdAndUpdate(
            cartId,
            { products: [] },
            { new: true }
        );
    }

    async delete(cartId) {
        return await CartModel.findByIdAndDelete(cartId);
    }

    async getAll() {
        return await CartModel.find().populate('products.product');
    }
}

export default new CartRepository();
