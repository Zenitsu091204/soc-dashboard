const express = require('express');
const router = express.Router();
const { getCampaigns } = require('../controllers/campaignController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getCampaigns);

module.exports = router;
