const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken'); // Require jwt to mock it later if needed
const { prismaMock } = require('../utils/singleton');
const alertRoutes = require('../routes/alertRoutes');
const { errorHandler, notFound } = require('../middleware/errorMiddleware');
const generateToken = require('../utils/generateToken');

// Set dummy JWT secret
process.env.JWT_SECRET = 'testsecret';

const app = express();
app.use(express.json());
app.use('/api/alerts', alertRoutes);
app.use(notFound);
app.use(errorHandler);

// Helper to get token (these now encode real tokens since secrect is set)
const adminToken = generateToken('admin-1', 'admin');
const analystToken = generateToken('user-1', 'analyst');

describe('Alerts API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock the user findUnique for auth middleware
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'admin-1',
      name: 'Admin',
      role: 'admin',
    });
  });

  describe('GET /api/alerts', () => {
    it('should get all alerts', async () => {
      const mockAlerts = [
        { id: '1', title: 'Alert 1' },
        { id: '2', title: 'Alert 2' }
      ];

      prismaMock.alert.findMany.mockResolvedValue(mockAlerts);

      const res = await request(app)
        .get('/api/alerts')
        .set('Authorization', `Bearer ${analystToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(2);
      expect(prismaMock.alert.findMany).toHaveBeenCalled();
    });
  });

  describe('POST /api/alerts', () => {
    it('should create an alert as admin', async () => {
      const mockAlert = {
        id: '1',
        title: 'New Alert',
        severity: 'Critical',
        status: 'open',
        source: 'Firewall',
      };

      prismaMock.alert.create.mockResolvedValue(mockAlert);

      const res = await request(app)
        .post('/api/alerts')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'New Alert',
          severity: 'critical',
          description: 'Test description',
          source: 'Firewall',
          entity: '10.0.0.1',
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.title).toEqual('New Alert');
      expect(prismaMock.alert.create).toHaveBeenCalled();
    });

    it('should fail validation when fields are missing', async () => {
      const res = await request(app)
        .post('/api/alerts')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Only Title',
        });

      expect(res.statusCode).toEqual(400);
    });
    
    it('should forbid analyst from creating alerts', async () => {
        // Change the mock to return an analyst
        prismaMock.user.findUnique.mockResolvedValue({
            id: 'user-1',
            name: 'Analyst',
            role: 'analyst',
        });

        const res = await request(app)
        .post('/api/alerts')
        .set('Authorization', `Bearer ${analystToken}`)
        .send({
          title: 'New Alert',
          severity: 'Critical',
          description: 'Test description',
          source: 'Firewall',
          entity: '10.0.0.1',
        });

      expect(res.statusCode).toEqual(403);
      expect(res.body.message).toEqual('Not authorized as an admin');
    });
  });

  describe('PATCH /api/alerts/:id', () => {
    it('should update alert status', async () => {
      const mockAlert = {
        id: '1',
        title: 'Alert 1',
        status: 'open',
      };

      prismaMock.alert.update.mockResolvedValue({ ...mockAlert, status: 'resolved' });

      const res = await request(app)
        .patch('/api/alerts/1')
        .set('Authorization', `Bearer ${analystToken}`)
        .send({ status: 'resolved' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('resolved');
      expect(prismaMock.alert.update).toHaveBeenCalled();
    });

    it('should return 404 if alert not found', async () => {
      // P2025 is Prisma's error code for "Record to update not found"
      const error = new Error('Record to update not found');
      error.code = 'P2025';
      prismaMock.alert.update.mockRejectedValue(error);

      const res = await request(app)
        .patch('/api/alerts/999')
        .set('Authorization', `Bearer ${analystToken}`)
        .send({ status: 'resolved' });

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Alert not found');
    });
  });

  describe('GET /api/alerts/stats', () => {
      it('should return 0 stats when there are no alerts', async () => {
        prismaMock.alert.count.mockResolvedValueOnce(0); // total Alerts
        prismaMock.alert.count.mockResolvedValueOnce(0); // critical Alerts
        prismaMock.alert.count.mockResolvedValueOnce(0); // high Alerts
        prismaMock.case.count.mockResolvedValueOnce(0); // open Cases
        prismaMock.ioc.count.mockResolvedValueOnce(0); // active Iocs
        
        const res = await request(app)
          .get('/api/alerts/stats')
          .set('Authorization', `Bearer ${analystToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.totalAlerts).toEqual(0);
        expect(res.body.criticalAlerts).toEqual(0);
        expect(res.body.highAlerts).toEqual(0);
        expect(res.body.openCases).toEqual(0);
        expect(res.body.activeIocs).toEqual(0);
      });
  });
});
