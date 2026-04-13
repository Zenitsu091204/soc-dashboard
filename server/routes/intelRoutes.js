const express = require('express');
const router = express.Router();
const { 
  getThreatActors, 
  getThreatActorById, 
  getIocs, 
  getIocById, 
  getOpenCtiMatches,
  createIoc,
  testCtiConnection,
  triggerSync,
  getSyncStatus,
  getReports,
  getIncidents,
  getMalware,
  getRelationships,
  getConnectors
} = require('../controllers/intelController');
const { protect } = require('../middleware/authMiddleware');

router.get('/threat-actors', protect, getThreatActors);
router.get('/threat-actors/:id', protect, getThreatActorById);
router.get('/iocs', protect, getIocs);
router.post('/iocs', protect, createIoc);
router.get('/iocs/:id', protect, getIocById);
router.get('/opencti-matches', protect, getOpenCtiMatches);
router.get('/test-connection', protect, testCtiConnection);
router.post('/sync', protect, triggerSync);
router.get('/sync/status', protect, getSyncStatus);

// OpenCTI Expanded Entities
router.get('/reports', protect, getReports);
router.get('/incidents', protect, getIncidents);
router.get('/malware', protect, getMalware);
router.get('/relationships', protect, getRelationships);
router.get('/connectors', protect, getConnectors);

module.exports = router;
