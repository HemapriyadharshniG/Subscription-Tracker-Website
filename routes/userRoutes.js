const express = require('express');
const router = express.Router();
const { updateProfile, updatePassword, deleteAccount } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.use(protect); // All routes require authentication

router.put('/profile', updateProfile);
router.put('/password', updatePassword);
router.delete('/account', deleteAccount);

module.exports = router;

