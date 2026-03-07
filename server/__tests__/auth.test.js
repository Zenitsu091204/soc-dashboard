const request = require('supertest');
const express = require('express');
const { prismaMock } = require('../utils/singleton');
const authRoutes = require('../routes/authRoutes');
const { errorHandler, notFound } = require('../middleware/errorMiddleware');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

process.env.JWT_SECRET = 'testsecret';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use(notFound);
app.use(errorHandler);

describe('Auth API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      
      const mockUser = {
        id: '1',
        name: 'Test user',
        email: 'test@example.com',
        role: 'analyst',
        password: 'hashedpassword'
      };

      prismaMock.user.create.mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test user',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.email).toEqual('test@example.com');
      expect(prismaMock.user.create).toHaveBeenCalledTimes(1);
    });

    it('should fail if user already exists', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: '1', email: 'test@example.com' });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test user',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual('User already exists');
    });

    it('should fail validation with invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test user',
          email: 'not-an-email',
          password: 'password123'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual('Invalid email address');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login valid user', async () => {
      const password = 'password123';
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const mockUser = {
        id: '1',
        name: 'Test user',
        email: 'test@example.com',
        role: 'analyst',
        password: hashedPassword
      };

      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.email).toEqual('test@example.com');
    });

    it('should fail with invalid password', async () => {
      const password = 'password123';
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const mockUser = {
        id: '1',
        name: 'Test user',
        email: 'test@example.com',
        role: 'analyst',
        password: hashedPassword
      };

      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toEqual('Invalid email or password');
    });
  });

  describe('GET /api/auth/profile', () => {
    it('should get profile for authenticated user', async () => {
      const mockUser = {
        id: '1',
        name: 'Test user',
        email: 'test@example.com',
        role: 'analyst',
        createdAt: new Date().toISOString()
      };

      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      
      const token = generateToken('1', 'analyst');

      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.name).toEqual('Test user');
    });

    it('should fail for unauthenticated request', async () => {
      const res = await request(app)
        .get('/api/auth/profile');

      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toEqual('Not authorized, no token');
    });
  });
});
