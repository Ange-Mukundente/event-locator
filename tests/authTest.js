const request = require('supertest');
const app = require('../app');

describe('Auth API', () => {
    it('should register a user', async () => {
        const res = await request(app).post('/api/auth/register').send({
            name: 'John Doe',
            email: 'john@example.com',
            password: '123456'
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.user).toHaveProperty('email', 'john@example.com');
    });
});
