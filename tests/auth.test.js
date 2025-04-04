const request = require('supertest');
const { app } = require('../server'); 
const mongoose = require('mongoose');
const User = require('../models/User'); // Your User model

describe('Authentication Routes', () => {
  beforeAll(async () => {
    // If no active Mongoose connection, connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/auth_test');
    }
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase(); // Optional
    await mongoose.connection.close();
  });

  describe('POST /api/auth/register', () => {
    it('should register a user and return a token', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      const response = await request(app).post('/api/auth/register').send(userData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(userData.email);
    });

    it('should return validation errors if inputs are invalid', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ name: '', email: 'invalidemail', password: 'short' });

      expect(response.status).toBe(400);
      expect(response.body.errors.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login a user and return a token', async () => {
      const user = await User.create({
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        password: 'password123',
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'jane.doe@example.com', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe('jane.doe@example.com');
    });

    it('should return invalid credentials if email or password is wrong', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'wrongpassword' });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should return validation errors if inputs are invalid', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'invalidemail', password: '' });

      expect(response.status).toBe(400);
      expect(response.body.errors.length).toBeGreaterThan(0);
    });
  });
});
