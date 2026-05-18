import ProductModel from '../../models/product.model.js';

export const createFakeProduct = async (overrides = {}) => {
    const productData = {
        title: `Test Product ${Date.now()}`,
        description: 'Test product description for testing purposes',
        code: `TEST-${Date.now()}`,
        price: 99.99,
        stock: 100,
        category: 'Electronicos',
        thumbnails: 'test-image.png',
        ...overrides
    };
    return await ProductModel.create(productData);
};

export const createFakeProducts = async (count = 5, overrides = {}) => {
    const products = [];
    for (let i = 0; i < count; i++) {
        const product = await createFakeProduct({
            title: `Test Product ${Date.now()}-${i}`,
            code: `TEST-${Date.now()}-${i}`,
            ...overrides
        });
        products.push(product);
    }
    return products;
};

export const invalidProductData = {
    missingFields: {
        title: 'Test'
    },
    invalidPrice: {
        title: 'Test Product',
        description: 'Test description',
        code: 'TEST-001',
        price: -10,
        stock: 10,
        category: 'Electronicos'
    },
    invalidStock: {
        title: 'Test Product',
        description: 'Test description',
        code: 'TEST-002',
        price: 10,
        stock: -5,
        category: 'Electronicos'
    }
};