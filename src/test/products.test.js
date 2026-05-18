import mongoose from 'mongoose';
import request from 'supertest';
import express from 'express';
import productsRouter from '../routes/products.router.js';
import { setupTestDB, teardownTestDB, clearCollections } from './test-db.js';
import { createFakeProduct, createFakeProducts, invalidProductData } from './mocks/product.mocks.js';

const app = express();
app.use(express.json());
app.use('/api/products', productsRouter);

let testProduct;

beforeAll(async () => {
    await setupTestDB();
});

afterAll(async () => {
    await teardownTestDB();
});

beforeEach(async () => {
    await clearCollections();
    testProduct = await createFakeProduct();
});

describe('Products Router - GET Endpoints', () => {
    describe('GET /api/products', () => {
        it('should return all products with pagination', async () => {
            const response = await request(app).get('/api/products');

            expect(response.status).toBe(200);
            expect(response.body.status).toBe('success');
            expect(response.body.docs).toBeDefined();
            expect(Array.isArray(response.body.docs)).toBe(true);
            expect(response.body.totalDocs).toBeDefined();
            expect(response.body.totalPages).toBeDefined();
            expect(response.body.page).toBeDefined();
        });

        it('should return empty array when no products exist', async () => {
            await clearCollections();
            const response = await request(app).get('/api/products');

            expect(response.status).toBe(200);
            expect(response.body.docs).toHaveLength(0);
        });

        it('should support pagination parameters', async () => {
            await createFakeProducts(15);

            const response = await request(app)
                .get('/api/products')
                .query({ page: 1, limit: 5 });

            expect(response.status).toBe(200);
            expect(response.body.docs).toHaveLength(5);
            expect(response.body.totalPages).toBeGreaterThanOrEqual(1);
        });

        it('should support sorting', async () => {
            await createFakeProducts(3);

            const response = await request(app)
                .get('/api/products')
                .query({ sort: -1 });

            expect(response.status).toBe(200);
            expect(response.body.docs).toBeDefined();
        });
    });

    describe('GET /api/products/:pid', () => {
        it('should return a product by ID', async () => {
            const response = await request(app).get(`/api/products/${testProduct._id}`);

            expect(response.status).toBe(200);
            expect(response.body.status).toBe('success');
            expect(response.body.payload).toBeDefined();
            expect(response.body.payload.title).toBe(testProduct.title);
            expect(response.body.payload.code).toBe(testProduct.code);
        });

        it('should handle non-existent product ID', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await request(app).get(`/api/products/${fakeId}`);

            expect([404, 500]).toContain(response.status);
        });

        it('should handle invalid product ID format', async () => {
            const response = await request(app).get('/api/products/invalid-id');

            expect([400, 500]).toContain(response.status);
        });
    });
});

describe('Products Router - POST Endpoint', () => {
    describe('POST /api/products', () => {
        it('should require authentication', async () => {
            const response = await request(app)
                .post('/api/products')
                .send({
                    title: 'New Product',
                    description: 'New product description',
                    code: 'NEW-001',
                    price: 50,
                    stock: 20,
                    category: 'Electronicos'
                });

            expect(response.status).toBe(401);
        });

        it('should reject requests without valid authentication', async () => {
            const response = await request(app)
                .post('/api/products')
                .set('Authorization', 'Bearer invalid-token')
                .send({
                    title: 'New Product',
                    description: 'New product description',
                    code: 'NEW-001',
                    price: 50,
                    stock: 20,
                    category: 'Electronicos'
                });

            expect([401, 403]).toContain(response.status);
        });
    });
});

describe('Products Router - PUT Endpoint', () => {
    describe('PUT /api/products/:pid', () => {
        it('should require authentication', async () => {
            const response = await request(app)
                .put(`/api/products/${testProduct._id}`)
                .send({ price: 200 });

            expect(response.status).toBe(401);
        });

        it('should reject requests without valid authentication', async () => {
            const response = await request(app)
                .put(`/api/products/${testProduct._id}`)
                .set('Authorization', 'Bearer invalid-token')
                .send({ price: 200 });

            expect([401, 403]).toContain(response.status);
        });
    });
});

describe('Products Router - DELETE Endpoint', () => {
    describe('DELETE /api/products/:pid', () => {
        it('should require authentication', async () => {
            const response = await request(app)
                .delete(`/api/products/${testProduct._id}`);

            expect(response.status).toBe(401);
        });

        it('should reject requests without valid authentication', async () => {
            const response = await request(app)
                .delete(`/api/products/${testProduct._id}`)
                .set('Authorization', 'Bearer invalid-token');

            expect([401, 403]).toContain(response.status);
        });
    });
});

describe('Products Router - Edge Cases', () => {
    it('should handle products with special characters in title', async () => {
        const product = await createFakeProduct({
            title: 'Product with "quotes" & <special> chars'
        });

        const response = await request(app).get(`/api/products/${product._id}`);

        expect(response.status).toBe(200);
    });

    it('should handle large pagination limit', async () => {
        await createFakeProducts(5);

        const response = await request(app)
            .get('/api/products')
            .query({ limit: 100 });

        expect(response.status).toBe(200);
    });

    it('should handle negative page number', async () => {
        const response = await request(app)
            .get('/api/products')
            .query({ page: -1 });

        expect(response.status).toBe(200);
    });
});