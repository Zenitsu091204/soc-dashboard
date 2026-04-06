const express = require('express');
const router = express.Router();
const { 
  getRules, 
  createRuleFromIoc, 
  updateRuleStatus, 
  deployRules,
  getRuleStats
} = require('../controllers/ruleController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');

router.get('/', protect, authorize('admin', 'analyst', 'read-only'), getRules);
router.get('/stats', protect, authorize('admin', 'analyst', 'read-only'), getRuleStats);
router.post('/generate', protect, authorize('admin', 'analyst'), createRuleFromIoc);
router.patch('/:id/status', protect, authorize('admin', 'analyst'), updateRuleStatus);
router.post('/deploy', protect, authorize('admin'), deployRules);

module.exports = router;
