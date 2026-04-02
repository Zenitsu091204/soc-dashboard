const express = require('express');
const router = express.Router();
const { 
  getIncidents, 
  getIncidentById,
  updateIncident, 
  linkIoc,
  linkRule,
  getIncidentTimeline 
} = require('../controllers/incidentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');

router.get('/', protect, authorize('admin', 'analyst'), getIncidents);
router.get('/:id', protect, authorize('admin', 'analyst'), getIncidentById);
router.patch('/:id', protect, authorize('admin', 'analyst'), updateIncident);
router.post('/:id/iocs', protect, authorize('admin', 'analyst'), linkIoc);
router.post('/:id/rules', protect, authorize('admin', 'analyst'), linkRule);
router.get('/:id/timeline', protect, authorize('admin', 'analyst'), getIncidentTimeline);

module.exports = router;
