const express = require('express');
const router = express.Router();
const { 
  getThreatActors, 
  getThreatActorById, 
  getIocs, 
  getIocById, 
  getOpenCtiMatches,
  createIoc,
  triggerSync,
  getSyncStatus
} = require('../controllers/intelController');
const { protect } = require('../middleware/authMiddleware');

router.get('/threat-actors', protect, getThreatActors);
router.get('/threat-actors/:id', protect, getThreatActorById);
router.get('/iocs', protect, getIocs);
router.post('/iocs', protect, createIoc);
router.get('/iocs/:id', protect, getIocById);
router.get('/opencti-matches', protect, getOpenCtiMatches);
router.post('/sync', protect, triggerSync);
router.get('/sync/status', protect, getSyncStatus);

module.exports = router;
