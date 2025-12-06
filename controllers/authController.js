const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const EmailSubscription = require('../models/EmailSubscription');
const { validationResult } = require('express-validator');
const { getAuthUrl, getTokens, getUserInfo } = require('../config/google');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback-secret', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password,
    });

    if (user) {
      // Check if there are pre-populated subscriptions for this email
      try {
        const emailSubscriptions = await EmailSubscription.findOne({ email: email.toLowerCase() });

        if (emailSubscriptions && emailSubscriptions.subscriptions.length > 0) {
          // Import subscriptions for the new user
          const subscriptionsToCreate = emailSubscriptions.subscriptions.map(sub => ({
            user: user._id,
            name: sub.name,
            category: sub.category,
            monthlyCost: sub.monthlyCost,
            renewalDate: sub.renewalDate,
            paymentMethod: sub.paymentMethod || '',
            autoRenewal: sub.autoRenewal !== undefined ? sub.autoRenewal : true,
            currency: sub.currency || 'INR',
          }));

          await Subscription.insertMany(subscriptionsToCreate);
          console.log(`✅ Imported ${subscriptionsToCreate.length} subscriptions for ${email}`);
        }
      } catch (importError) {
        console.error('Error importing subscriptions:', importError);
        // Don't fail signup if subscription import fails
      }

      const token = generateToken(user._id);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        theme: user.theme,
        token,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        theme: user.theme,
        emailNotifications: user.emailNotifications,
        token,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      theme: user.theme,
      emailNotifications: user.emailNotifications,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Initiate Google OAuth
// @route   GET /api/auth/google
// @access  Public
exports.googleAuth = (req, res) => {
  const url = getAuthUrl();
  res.redirect(url);
};

// @desc    Handle Google OAuth callback
// @route   GET /api/auth/google/callback
// @access  Public
exports.googleCallback = async (req, res) => {
  try {
    const { code } = req.query;
    const tokens = await getTokens(code);
    const googleUser = await getUserInfo(tokens.access_token);

    // Check if user exists
    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      // Create new user
      user = await User.create({
        name: googleUser.name,
        email: googleUser.email,
        password: Math.random().toString(36).slice(-8), // Random password
        isGoogleUser: true,
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Redirect to frontend with token
    // In production, use a secure cookie or a temporary code exchange
    res.redirect(`http://localhost:3000/auth/google/success?token=${token}`);
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.redirect('http://localhost:3000/login?error=google_auth_failed');
  }
};

