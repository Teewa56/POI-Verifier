const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/userModel');
const Token = require('../models/tokenModel');

let testUser;
let testToken;

beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    
    testUser = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        passwordConfirm: 'password123',
    });
});

afterAll(async () => {
    await User.deleteMany();
    await Token.deleteMany();
    await mongoose.disconnect();
});

describe('Auth Controller', () => {
    describe('POST /api/auth/signup', () => {
        it('should create a new user', async () => {
            const res = await request(app)
                .post('/api/auth/signup')
                .send({
                name: 'New User',
                email: 'new@example.com',
                password: 'password123',
                passwordConfirm: 'password123',
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body.status).toEqual('success');
            expect(res.body.data.user.email).toEqual('new@example.com');
            expect(res.body.token).toBeDefined();
        });

        it('should fail with invalid email', async () => {
            const res = await request(app)
                .post('/api/auth/signup')
                .send({
                name: 'New User',
                email: 'invalid-email',
                password: 'password123',
                passwordConfirm: 'password123',
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body.status).toEqual('fail');
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login with correct credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                email: 'test@example.com',
                password: 'password123',
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body.status).toEqual('success');
            expect(res.body.token).toBeDefined();
            testToken = res.body.token;
        });

        it('should fail with incorrect password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                email: 'test@example.com',
                password: 'wrongpassword',
                });

            expect(res.statusCode).toEqual(401);
            expect(res.body.status).toEqual('fail');
        });
    });

    describe('POST /api/auth/refresh-token', () => {
        let refreshToken;

        beforeEach(async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                email: 'test@example.com',
                password: 'password123',
                });
            
            refreshToken = res.body.refreshToken;
        });

        it('should generate new tokens with valid refresh token', async () => {
            const res = await request(app)
                .post('/api/auth/refresh-token')
                .send({
                refreshToken,
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body.status).toEqual('success');
            expect(res.body.token).toBeDefined();
            expect(res.body.refreshToken).toBeDefined();
        });

        it('should fail with invalid refresh token', async () => {
            const res = await request(app)
                .post('/api/auth/refresh-token')
                .send({
                refreshToken: 'invalid-token',
                });

            expect(res.statusCode).toEqual(401);
            expect(res.body.status).toEqual('fail');
        });
    });

    describe('GET /api/auth/protected-route', () => {
        it('should access protected route with valid token', async () => {
            const res = await request(app)
                .get('/api/insights') // Protected route
                .set('Authorization', `Bearer ${testToken}`);

            expect(res.statusCode).toEqual(200);
        });

        it('should fail without token', async () => {
            const res = await request(app)
                .get('/api/insights');

            expect(res.statusCode).toEqual(401);
        });
    });
});