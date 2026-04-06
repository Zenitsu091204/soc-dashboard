const express = require('express');
const router = express.Router();
const { 
  getIntegrations, 
  updateIntegration, 
  getWorkspaceSettings, 
  updateWorkspaceSettings 
} = require('../controllers/settingsController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/integrations', protect, admin, getIntegrations);
router.patch('/integrations/:id', protect, admin, updateIntegration);

router.get('/workspace', protect, getWorkspaceSettings);
router.post('/workspace', protect, admin, updateWorkspaceSettings);

module.exports = router;
