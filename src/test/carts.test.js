import mongoose from 'mongoose';
import request from 'supertest';
import express from 'express';
import cartRouter from '../routes/carts.router.js';
import { setupTestDB, teardownTestDB, clearCollections } from './test-db.js';
import { createCartWithProducts, createEmptyCart } from './mocks/cart.mocks.js';
import { createFakeProduct } from './mocks/product.mocks.js';

const app = express();
app.use(express.json());
app.use('/api/carts', cartRouter);

let testCart;
let testProduct;

beforeAll(async () => {
    await setupTestDB();
});

afterAll(async () => {
    await teardownTestDB();
});

beforeEach(async () => {
    await clearCollections();
    testCart = await createCartWithProducts(2);
    testProduct = await createFakeProduct({
        title: 'Test Cart Product',
        code: `CART-TEST-${Date.now()}`
    });
});

describe('Carts Router - GET Endpoints', () => {
    describe('GET /api/carts/:cartId', () => {
        it('should return cart by ID', async () => {
            const response = await request(app).get(`/api/carts/${testCart._id}`);

            expect(response.status).toBe(200);
            expect(response.body.status).toBe('success');
            expect(response.body.payload).toBeDefined();
            expect(response.body.payload._id).toBe(testCart._id.toString());
            expect(Array.isArray(response.body.payload.products)).toBe(true);
        });

        it('should handle non-existent cart', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await request(app).get(`/api/carts/${fakeId}`);

            expect([404, 500]).toContain(response.status);
        });

        it('should handle invalid cart ID format', async () => {
            const response = await request(app).get('/api/carts/invalid-id');

            expect([400, 500]).toContain(response.status);
        });

        it('should include total in response', async () => {
            const response = await request(app).get(`/api/carts/${testCart._id}`);

            expect(response.body.payload.total).toBeDefined();
            expect(typeof response.body.payload.total).toBe('number');
        });
    });

    describe('GET /api/carts/ticket/:ticketId', () => {
        it('should handle non-existent ticket', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await request(app).get(`/api/carts/ticket/${fakeId}`);

            expect([404, 500]).toContain(response.status);
        });
    });
});

describe('Carts Router - POST Endpoints', () => {
    describe('POST /api/carts/:cartId/product', () => {
        it('should require authentication', async () => {
            const response = await request(app)
                .post(`/api/carts/${testCart._id}/product`)
                .send({ productId: testProduct._id, quantity: 1 });

            expect(response.status).toBe(401);
        });

        it('should reject requests without valid authentication', async () => {
            const response = await request(app)
                .post(`/api/carts/${testCart._id}/product`)
                .set('Authorization', 'Bearer invalid-token')
                .send({ productId: testProduct._id, quantity: 1 });

            expect([401, 403]).toContain(response.status);
        });
    });

    describe('POST /api/carts/:cartId/purchase', () => {
        it('should require authentication', async () => {
            const response = await request(app)
                .post(`/api/carts/${testCart._id}/purchase`);

            expect(response.status).toBe(401);
        });

        it('should reject requests without valid authentication', async () => {
            const response = await request(app)
                .post(`/api/carts/${testCart._id}/purchase`)
                .set('Authorization', 'Bearer invalid-token');

            expect([401, 403]).toContain(response.status);
        });
    });
});

describe('Carts Router - PUT Endpoints', () => {
    describe('PUT /api/carts/:cartId/product/:productId', () => {
        it('should require authentication', async () => {
            const productInCart = testCart.products[0].product;
            const response = await request(app)
                .put(`/api/carts/${testCart._id}/product/${productInCart}`)
                .send({ quantity: 5 });

            expect(response.status).toBe(401);
        });

        it('should reject requests without valid authentication', async () => {
            const productInCart = testCart.products[0].product;
            const response = await request(app)
                .put(`/api/carts/${testCart._id}/product/${productInCart}`)
                .set('Authorization', 'Bearer invalid-token')
                .send({ quantity: 5 });

            expect([401, 403]).toContain(response.status);
        });
    });
});

describe('Carts Router - DELETE Endpoints', () => {
    describe('DELETE /api/carts/:cartId/product/:productId', () => {
        it('should require authentication', async () => {
            const productInCart = testCart.products[0].product;
            const response = await request(app)
                .delete(`/api/carts/${testCart._id}/product/${productInCart}`);

            expect(response.status).toBe(401);
        });

        it('should reject requests without valid authentication', async () => {
            const productInCart = testCart.products[0].product;
            const response = await request(app)
                .delete(`/api/carts/${testCart._id}/product/${productInCart}`)
                .set('Authorization', 'Bearer invalid-token');

            expect([401, 403]).toContain(response.status);
        });
    });

    describe('DELETE /api/carts/:cartId', () => {
        it('should require authentication', async () => {
            const response = await request(app)
                .delete(`/api/carts/${testCart._id}`);

            expect(response.status).toBe(401);
        });

        it('should reject requests without valid authentication', async () => {
            const response = await request(app)
                .delete(`/api/carts/${testCart._id}`)
                .set('Authorization', 'Bearer invalid-token');

            expect([401, 403]).toContain(response.status);
        });
    });
});

describe('Carts Router - Edge Cases', () => {
    it('should handle empty cart gracefully', async () => {
        const emptyCart = await createEmptyCart();
        const response = await request(app).get(`/api/carts/${emptyCart._id}`);

        expect(response.status).toBe(200);
        expect(response.body.payload.products).toHaveLength(0);
    });

    it('should handle cart with many products', async () => {
        const cartWithMany = await createCartWithProducts(10);
        const response = await request(app).get(`/api/carts/${cartWithMany._id}`);

        expect(response.status).toBe(200);
        expect(response.body.payload.products.length).toBeGreaterThan(5);
    });

    it('should handle cart with zero quantity', async () => {
        const productInCart = testCart.products[0].product;
        const response = await request(app)
            .put(`/api/carts/${testCart._id}/product/${productInCart}`)
            .set('Authorization', 'Bearer invalid-token')
            .send({ quantity: 0 });

        expect([400, 401, 403]).toContain(response.status);
    });
});