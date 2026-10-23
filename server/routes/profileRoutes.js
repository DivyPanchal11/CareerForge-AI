const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  uploadAvatar,
  changePassword,
} = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

// All profile endpoints require authentication
router.get('/', protect, getProfile);
router.get('/me', protect, getProfile);
router.put('/', protect, updateProfile);
router.post('/avatar', protect, uploadAvatar);
router.put('/change-password', protect, changePassword);

module.exports = router;
