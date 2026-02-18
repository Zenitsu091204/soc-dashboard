const express = require('express');
const router = express.Router();
const {
  getAlerts,
  createAlert,
  updateAlertStatus,
  getStats,
} = require('../controllers/alertController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, getAlerts);
router.post('/', protect, createAlert);
router.get('/stats', protect, getStats);
router.patch('/:id', protect, updateAlertStatus);

module.exports = router;
