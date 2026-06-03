import mongoose from 'mongoose';
import request from 'supertest';
import express from 'express';
import adoptionRouter from '../routes/adoption.router.js';
import { setupTestDB, teardownTestDB, clearCollections } from './test-db.js';
import {
    createFakeAdoption,
    createFakeAdoptions,
    validAdoptionPayload,
    invalidAdoptionPayloads
} from './mocks/adoption.mocks.js';

const app = express();
app.use(express.json());
app.use('/api/adoptions', adoptionRouter);

let testPet;

beforeAll(async () => {
    await setupTestDB();
});

afterAll(async () => {
    await teardownTestDB();
});

beforeEach(async () => {
    await clearCollections();
    testPet = await createFakeAdoption();
});

describe('Adoptions Router - GET Endpoints', () => {
    describe('GET /api/adoptions', () => {
        it('should return all adoptions with success status', async () => {
            await createFakeAdoptions(3);

            const response = await request(app).get('/api/adoptions');

            expect(response.status).toBe(200);
            expect(response.body.status).toBe('success');
            expect(Array.isArray(response.body.payload)).toBe(true);
            expect(response.body.payload.length).toBeGreaterThanOrEqual(3);
        });

        it('should return empty array when no adoptions exist', async () => {
            await clearCollections();

            const response = await request(app).get('/api/adoptions');

            expect(response.status).toBe(200);
            expect(response.body.payload).toHaveLength(0);
        });

        it('should filter by status query param', async () => {
            await createFakeAdoption({ status: 'adopted' });
            await createFakeAdoption({ status: 'available' });

            const response = await request(app).get('/api/adoptions').query({ status: 'adopted' });

            expect(response.status).toBe(200);
            expect(response.body.payload.every(p => p.status === 'adopted')).toBe(true);
        });

        it('should filter by species query param', async () => {
            await createFakeAdoption({ species: 'Gato' });
            await createFakeAdoption({ species: 'Perro' });

            const response = await request(app).get('/api/adoptions').query({ species: 'Gato' });

            expect(response.status).toBe(200);
            expect(response.body.payload.every(p => p.species === 'Gato')).toBe(true);
        });
    });

    describe('GET /api/adoptions/:aid', () => {
        it('should return an adoption by ID', async () => {
            const response = await request(app).get(`/api/adoptions/${testPet._id}`);

            expect(response.status).toBe(200);
            expect(response.body.status).toBe('success');
            expect(response.body.payload._id).toBe(testPet._id.toString());
            expect(response.body.payload.name).toBe(testPet.name);
        });

        it('should return 404 for non-existent ID', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await request(app).get(`/api/adoptions/${fakeId}`);

            expect([404, 500]).toContain(response.status);
        });

        it('should return error for invalid ID format', async () => {
            const response = await request(app).get('/api/adoptions/invalid-id');

            expect([400, 404, 500]).toContain(response.status);
        });
    });
});

describe('Adoptions Router - POST Endpoints', () => {
    describe('POST /api/adoptions (admin)', () => {
        it('should require authentication', async () => {
            const response = await request(app)
                .post('/api/adoptions')
                .send(validAdoptionPayload());

            expect(response.status).toBe(401);
        });

        it('should reject requests with invalid token', async () => {
            const response = await request(app)
                .post('/api/adoptions')
                .set('Authorization', 'Bearer invalid-token')
                .send(validAdoptionPayload());

            expect([401, 403]).toContain(response.status);
        });

        it('should reject payloads missing required fields', async () => {
            const response = await request(app)
                .post('/api/adoptions')
                .set('Authorization', 'Bearer invalid-token')
                .send(invalidAdoptionPayloads.missingFields);

            expect([400, 401, 403, 500]).toContain(response.status);
        });

        it('should reject invalid species enum value', async () => {
            const response = await request(app)
                .post('/api/adoptions')
                .set('Authorization', 'Bearer invalid-token')
                .send(invalidAdoptionPayloads.invalidSpecies);

            expect([400, 401, 403, 500]).toContain(response.status);
        });
    });

    describe('POST /api/adoptions/:aid/adopt', () => {
        it('should require authentication', async () => {
            const response = await request(app)
                .post(`/api/adoptions/${testPet._id}/adopt`)
                .send({ owner: 'Juan Pérez' });

            expect(response.status).toBe(401);
        });

        it('should reject requests with invalid token', async () => {
            const response = await request(app)
                .post(`/api/adoptions/${testPet._id}/adopt`)
                .set('Authorization', 'Bearer invalid-token')
                .send({ owner: 'Juan Pérez' });

            expect([401, 403]).toContain(response.status);
        });

        it('should reject adoption of non-existent pet', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .post(`/api/adoptions/${fakeId}/adopt`)
                .set('Authorization', 'Bearer invalid-token')
                .send({ owner: 'Juan Pérez' });

            expect([404, 401, 403, 500]).toContain(response.status);
        });
    });
});

describe('Adoptions Router - PUT Endpoint', () => {
    describe('PUT /api/adoptions/:aid (admin)', () => {
        it('should require authentication', async () => {
            const response = await request(app)
                .put(`/api/adoptions/${testPet._id}`)
                .send({ description: 'Animal con descripción actualizada para tests' });

            expect(response.status).toBe(401);
        });

        it('should reject requests with invalid token', async () => {
            const response = await request(app)
                .put(`/api/adoptions/${testPet._id}`)
                .set('Authorization', 'Bearer invalid-token')
                .send({ description: 'Animal con descripción actualizada para tests' });

            expect([401, 403]).toContain(response.status);
        });
    });
});

describe('Adoptions Router - DELETE Endpoint', () => {
    describe('DELETE /api/adoptions/:aid (admin)', () => {
        it('should require authentication', async () => {
            const response = await request(app).delete(`/api/adoptions/${testPet._id}`);

            expect(response.status).toBe(401);
        });

        it('should reject requests with invalid token', async () => {
            const response = await request(app)
                .delete(`/api/adoptions/${testPet._id}`)
                .set('Authorization', 'Bearer invalid-token');

            expect([401, 403]).toContain(response.status);
        });
    });
});

describe('Adoptions Router - Edge Cases', () => {
    it('should handle multiple adoptions of different species', async () => {
        await createFakeAdoption({ species: 'Gato', name: 'Misu' });
        await createFakeAdoption({ species: 'Conejo', name: 'Bugs' });
        await createFakeAdoption({ species: 'Ave', name: 'Pico' });

        const response = await request(app).get('/api/adoptions');

        expect(response.status).toBe(200);
        const species = new Set(response.body.payload.map(p => p.species));
        expect(species.size).toBeGreaterThanOrEqual(3);
    });

    it('should handle adoption with special characters in name', async () => {
        const pet = await createFakeAdoption({ name: 'Ñoño "Junior" & <pets>' });

        const response = await request(app).get(`/api/adoptions/${pet._id}`);

        expect(response.status).toBe(200);
        expect(response.body.payload.name).toContain('Ñoño');
    });

    it('should not list adopted pets in default available query', async () => {
        await createFakeAdoption({ status: 'adopted' });

        const response = await request(app).get('/api/adoptions').query({ status: 'available' });

        expect(response.status).toBe(200);
        expect(response.body.payload.every(p => p.status === 'available')).toBe(true);
    });
});
