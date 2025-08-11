const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/userModel');
const Insight = require('../models/insightModel');

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

    const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
        email: 'test@example.com',
        password: 'password123',
        });
    
    testToken = loginRes.body.token;
});

afterAll(async () => {
    await User.deleteMany();
    await Insight.deleteMany();
    await mongoose.disconnect();
});

describe('Insight Controller', () => {
    describe('POST /api/insights', () => {
        it('should create a new insight', async () => {
            const res = await request(app)
                .post('/api/insights')
                .set('Authorization', `Bearer ${testToken}`)
                .send({
                content: 'This is a test insight',
                tags: ['test', 'blockchain'],
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body.status).toEqual('success');
            expect(res.body.data.insight.content).toEqual('This is a test insight');
        });

        it('should fail without content', async () => {
            const res = await request(app)
                .post('/api/insights')
                .set('Authorization', `Bearer ${testToken}`)
                .send({
                tags: ['test'],
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body.status).toEqual('fail');
        });
    });

    describe('GET /api/insights', () => {
        beforeEach(async () => {
            await Insight.create([
                {
                content: 'First test insight',
                tags: ['test'],
                contentHash: 'hash1',
                user: testUser._id,
                },
                {
                content: 'Second test insight',
                tags: ['test', 'ai'],
                contentHash: 'hash2',
                user: testUser._id,
                },
            ]);
        });

        afterEach(async () => {
            await Insight.deleteMany();
        });

        it('should get all insights for the user', async () => {
            const res = await request(app)
                .get('/api/insights')
                .set('Authorization', `Bearer ${testToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.status).toEqual('success');
            expect(res.body.results).toEqual(2);
            expect(res.body.data.insights.length).toEqual(2);
        });

        it('should filter insights by tag', async () => {
            const res = await request(app)
                .get('/api/insights?tags=ai')
                .set('Authorization', `Bearer ${testToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.data.insights.length).toEqual(1);
            expect(res.body.data.insights[0].tags).toContain('ai');
        });
    });

    describe('GET /api/insights/:id', () => {
        let testInsight;

        beforeEach(async () => {
            testInsight = await Insight.create({
                content: 'Single test insight',
                tags: ['test'],
                contentHash: 'hash3',
                user: testUser._id,
            });
        });

        afterEach(async () => {
            await Insight.deleteMany();
        });

        it('should get a single insight', async () => {
            const res = await request(app)
                .get(`/api/insights/${testInsight._id}`)
                .set('Authorization', `Bearer ${testToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.data.insight._id).toEqual(testInsight._id.toString());
        });

        it('should fail with invalid insight ID', async () => {
            const res = await request(app)
                .get('/api/insights/invalid-id')
                .set('Authorization', `Bearer ${testToken}`);

            expect(res.statusCode).toEqual(400);
        });
    });
});