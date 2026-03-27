const express = require('express');
const router = express.Router();
const {
  authUser,
  registerUser,
  getUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per window
  message: { message: 'Too many attempts, please try again in 15 minutes' },
});

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, authUser);
router.get('/profile', protect, getUserProfile);

module.exports = router;
