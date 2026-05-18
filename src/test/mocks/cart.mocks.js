import CartModel from '../../models/cart.model.js';
import { createFakeProduct } from './product.mocks.js';

export const createFakeCart = async (products = []) => {
    return await CartModel.create({ products });
};

export const createCartWithProducts = async (count = 2) => {
    const products = [];
    for (let i = 0; i < count; i++) {
        const product = await createFakeProduct({
            title: `Cart Product ${Date.now()}-${i}`,
            code: `CART-${Date.now()}-${i}`
        });
        products.push({ product: product._id, quantity: i + 1 });
    }
    return await CartModel.create({ products });
};

export const createEmptyCart = async () => {
    return await CartModel.create({ products: [] });
};