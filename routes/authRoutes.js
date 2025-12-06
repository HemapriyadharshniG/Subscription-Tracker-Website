const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { signup, login, getMe, googleAuth, googleCallback } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Validation rules
const signupValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

router.post('/signup', signupValidation, signup);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

module.exports = router;

