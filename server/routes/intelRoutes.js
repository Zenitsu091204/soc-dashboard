const express = require('express');
const router = express.Router();
const { getThreatActors, getIocs, getOpenCtiMatches } = require('../controllers/intelController');
const { protect } = require('../middleware/authMiddleware');

router.get('/threat-actors', protect, getThreatActors);
router.get('/iocs', protect, getIocs);
router.get('/opencti-matches', protect, getOpenCtiMatches);

module.exports = router;
