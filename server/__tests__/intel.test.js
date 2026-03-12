const request = require('supertest');
const express = require('express');
const { prismaMock } = require('../utils/singleton');
const intelRoutes = require('../routes/intelRoutes');
const openCtiService = require('../services/openctiService');
const { errorHandler, notFound } = require('../middleware/errorMiddleware');
const generateToken = require('../utils/generateToken');

jest.mock('../services/openctiService');

process.env.JWT_SECRET = 'testsecret';

const app = express();
app.use(express.json());
app.use('/api/intel', intelRoutes);
app.use(notFound);
app.use(errorHandler);

const analystToken = generateToken('user-1', 'analyst');

describe('Intel API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock user for auth middleware
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'user-1',
      name: 'Analyst',
      role: 'analyst',
    });
  });

  describe('GET /api/intel/threat-actors', () => {
    it('should get all threat actors', async () => {
      const mockActors = [
        { id: '1', name: 'APT29' },
        { id: '2', name: 'Lazarus Group' }
      ];

      prismaMock.threatActor.findMany.mockResolvedValue(mockActors);

      const res = await request(app)
        .get('/api/intel/threat-actors')
        .set('Authorization', `Bearer ${analystToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(2);
      expect(prismaMock.threatActor.findMany).toHaveBeenCalled();
    });
    
    it('should handle unauthorized access', async () => {
        const res = await request(app)
          .get('/api/intel/threat-actors');

        expect(res.statusCode).toEqual(401);
    });
  });

  describe('GET /api/intel/iocs', () => {
    it('should get all IOCs', async () => {
      const mockIocs = [
        { id: '1', value: '10.0.0.1', type: 'IP' },
        { id: '2', value: 'malicious.com', type: 'Domain' }
      ];

      prismaMock.ioc.findMany.mockResolvedValue(mockIocs);

      const res = await request(app)
        .get('/api/intel/iocs')
        .set('Authorization', `Bearer ${analystToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(2);
      expect(prismaMock.ioc.findMany).toHaveBeenCalled();
    });
  });

  describe('GET /api/intel/opencti-matches', () => {
    it('should get all OpenCTI matches', async () => {
      const mockMatches = [
        { id: 'oc1', actor: 'APT29', type: 'Domain', value: 'x.com', confidence: 90, risk: 'Critical' }
      ];

      openCtiService.fetchOpenCtiMatches.mockResolvedValue(mockMatches);

      const res = await request(app)
        .get('/api/intel/opencti-matches')
        .set('Authorization', `Bearer ${analystToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(1);
      expect(openCtiService.fetchOpenCtiMatches).toHaveBeenCalled();
    });
  });
});
