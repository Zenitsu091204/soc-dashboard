const express = require('express');
const router = express.Router();
const {
  authUser,
  registerUser,
  getUserProfile,
  updateUserPassword,
  updateUserProfile,
  getAllUsers,
  toggleUserStatus,
  deleteUser,
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per window
  message: { message: 'Too many attempts, please try again in 15 minutes' },
});

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, authUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/password', protect, updateUserPassword);

// User Management (Admin only)
router.get('/users', protect, admin, getAllUsers);
router.post('/users', protect, admin, createUser);
router.patch('/users/:id/status', protect, admin, toggleUserStatus);
router.delete('/users/:id', protect, admin, deleteUser);

module.exports = router;
