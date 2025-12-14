const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // We will update server.js to export app
const User = require('../models/User');
const Sweet = require('../models/Sweet');

// Mock Data
const adminUser = { username: 'admin', password: 'password123', role: 'admin' };
const regularUser = { username: 'user', password: 'password123', role: 'customer' };
let adminToken = '';
let userToken = '';
let sweetId = '';

beforeAll(async () => {
    // Connect to a test database (or ensure your logic handles test mode)
    // Note: For simplicity in this Kata, we assume the main DB connection works
    // In a real strict environment, use a separate test DB.
});

describe('Sweet Shop API TDD', () => {

    // 1. Auth Tests
    it('POST /register - Should register a new user', async () => {
        const res = await request(app).post('/api/auth/register').send(adminUser);
        expect(res.statusCode).toBeOneOf([201, 400]); // 400 if already exists
    });

    it('POST /login - Should login and return JWT', async () => {
        const res = await request(app).post('/api/auth/login').send(adminUser);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        adminToken = res.body.token; // Save for later
    });

    it('POST /login - Regular user login', async () => {
        await request(app).post('/api/auth/register').send(regularUser);
        const res = await request(app).post('/api/auth/login').send(regularUser);
        userToken = res.body.token;
    });

    // 2. Sweets CRUD Tests
    it('POST /api/sweets - Admin should create a sweet', async () => {
        const res = await request(app)
            .post('/api/sweets')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Test Candy', category: 'Test', price: 1.00, quantity: 10 });
        expect(res.statusCode).toBe(201);
        sweetId = res.body._id;
    });

    it('POST /api/sweets - Customer should NOT create a sweet', async () => {
        const res = await request(app)
            .post('/api/sweets')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ name: 'Hacker Candy', category: 'Test', price: 1.00, quantity: 10 });
        expect(res.statusCode).toBe(403);
    });

    it('GET /api/sweets/search - Should filter sweets', async () => {
        const res = await request(app).get('/api/sweets/search?query=Test');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    // 3. Inventory Tests
    it('POST /purchase - User should buy sweet', async () => {
        const res = await request(app)
            .post(`/api/sweets/${sweetId}/purchase`)
            .set('Authorization', `Bearer ${userToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.sweet.quantity).toBe(9); // Started at 10
    });

    it('POST /restock - Admin should restock sweet', async () => {
        const res = await request(app)
            .post(`/api/sweets/${sweetId}/restock`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ amount: 5 });
        expect(res.statusCode).toBe(200);
        expect(res.body.quantity).toBe(14); // 9 + 5
    });

    // 4. Update/Delete Tests
    it('PUT /api/sweets/:id - Admin should update sweet', async () => {
        const res = await request(app)
            .put(`/api/sweets/${sweetId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ price: 2.50 });
        expect(res.statusCode).toBe(200);
        expect(res.body.price).toBe(2.50);
    });
});

// Helper for 'toBeOneOf' matchers if needed, or just check status
expect.extend({
  toBeOneOf(received, expected) {
    const pass = expected.includes(received);
    return {
      message: () => `expected ${received} to be one of ${expected}`,
      pass,
    };
  },
});