const express = require('express');
const router = express.Router();
const { getThreatActors, getIocs } = require('../controllers/intelController');
const { protect } = require('../middleware/authMiddleware');

router.get('/actors', protect, getThreatActors);
router.get('/iocs', protect, getIocs);

module.exports = router;
