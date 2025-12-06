const Subscription = require('../models/Subscription');
const User = require('../models/User');
const EmailSubscription = require('../models/EmailSubscription');
const { google } = require('googleapis');
const { oauth2Client } = require('../config/google');

// Common subscription patterns and keywords (India-based)
const SUBSCRIPTION_KEYWORDS = {
  'Netflix': { category: 'Entertainment', keywords: ['netflix'] },
  'Disney+ Hotstar': { category: 'Entertainment', keywords: ['hotstar', 'disney+ hotstar'] },
  'Amazon Prime Video': { category: 'Entertainment', keywords: ['amazon prime', 'prime video'] },
  'Zee5': { category: 'Entertainment', keywords: ['zee5'] },
  'SonyLIV': { category: 'Entertainment', keywords: ['sonyliv', 'sony liv'] },
  'Voot': { category: 'Entertainment', keywords: ['voot'] },
  'Spotify Premium': { category: 'Music', keywords: ['spotify', 'premium'] },
  'YouTube Premium': { category: 'Entertainment', keywords: ['youtube', 'premium'] },
  'JioSaavn': { category: 'Music', keywords: ['jiosaavn', 'saavn'] },
  'Apple Music': { category: 'Music', keywords: ['apple music'] },
  'Microsoft 365': { category: 'Productivity', keywords: ['microsoft 365', 'office 365'] },
  'Adobe Creative Cloud': { category: 'Productivity', keywords: ['adobe', 'creative cloud'] },
  'Google Drive': { category: 'Productivity', keywords: ['google drive', 'google one'] },
  'Dropbox': { category: 'Productivity', keywords: ['dropbox'] },
  'LinkedIn Premium': { category: 'Productivity', keywords: ['linkedin premium'] },
  'Gym Membership': { category: 'Fitness', keywords: ['gym', 'fitness', 'membership'] },
  'Cult.fit': { category: 'Fitness', keywords: ['cult.fit', 'cultfit'] },
  'Coursera': { category: 'Education', keywords: ['coursera'] },
  'Udemy': { category: 'Education', keywords: ['udemy'] },
  'Byju\'s': { category: 'Education', keywords: ['byjus', 'byju'] },
  'The Times of India': { category: 'News', keywords: ['times of india', 'toi'] },
  'The Hindu': { category: 'News', keywords: ['the hindu'] },
  'Jio Fiber': { category: 'Utilities', keywords: ['jio fiber', 'jiofiber'] },
  'Airtel Xstream': { category: 'Entertainment', keywords: ['airtel xstream', 'xstream'] },
};

// Detect subscriptions from email content (simplified version)
const detectFromEmail = (emailContent, userEmail) => {
  const detected = [];
  const lowerContent = emailContent.toLowerCase();

  for (const [serviceName, config] of Object.entries(SUBSCRIPTION_KEYWORDS)) {
    const found = config.keywords.some(keyword => lowerContent.includes(keyword));
    if (found) {
      // Try to extract amount and date from email
      const amountMatch = emailContent.match(/\$?(\d+\.?\d*)/g);
      const dateMatch = emailContent.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})|(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/);

      detected.push({
        name: serviceName,
        category: config.category,
        monthlyCost: amountMatch ? parseFloat(amountMatch[0].replace('$', '')) : 0,
        renewalDate: dateMatch ? new Date(dateMatch[0]) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        detected: true,
      });
    }
  }

  return detected;
};

// @desc    Detect subscriptions from user's email/phone
// @route   POST /api/subscriptions/detect
// @access  Private
exports.detectSubscriptions = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get existing subscriptions to avoid duplicates
    let existingSubs = [];
    let existingNames = [];

    try {
      existingSubs = await Subscription.find({ user: req.user._id });
      existingNames = existingSubs.map(sub => sub.name.toLowerCase());
    } catch (dbError) {
      console.error('Error fetching existing subscriptions:', dbError);
      // Continue even if we can't fetch existing subscriptions
      existingNames = [];
    }

    // Check for pre-populated subscriptions for this email
    let emailBasedSubscriptions = [];
    try {
      // Use provided email or fallback to user's email
      const targetEmail = req.body.email ? req.body.email.toLowerCase() : user.email.toLowerCase();
      const emailSubs = await EmailSubscription.findOne({ email: targetEmail });
      if (emailSubs && emailSubs.subscriptions) {
        emailBasedSubscriptions = emailSubs.subscriptions
          .filter(sub => !existingNames.includes(sub.name.toLowerCase()))
          .map(sub => ({
            name: sub.name,
            category: sub.category,
            monthlyCost: sub.monthlyCost,
            renewalDate: sub.renewalDate,
            paymentMethod: sub.paymentMethod || '',
            autoRenewal: sub.autoRenewal !== undefined ? sub.autoRenewal : true,
            currency: sub.currency || 'INR',
            detected: true,
            fromEmail: true, // Mark as from email database
          }));
      }
    } catch (emailSubError) {
      console.error('Error fetching email-based subscriptions:', emailSubError);
    }

    // Suggest common subscriptions that user might have
    const suggestedSubscriptions = Object.keys(SUBSCRIPTION_KEYWORDS)
      .filter(name => !existingNames.includes(name.toLowerCase()))
      .map(name => ({
        name,
        category: SUBSCRIPTION_KEYWORDS[name].category,
        monthlyCost: 0, // User will need to fill this
        renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default to 30 days from now
        detected: true,
        suggested: true,
      }));

    // Combine email-based and suggested subscriptions (prioritize email-based)
    const allDetected = [...emailBasedSubscriptions, ...suggestedSubscriptions];

    res.json({
      detected: allDetected,
      message: allDetected.length > 0
        ? emailBasedSubscriptions.length > 0
          ? `Found ${emailBasedSubscriptions.length} subscription(s) linked to your email and ${suggestedSubscriptions.length} suggested subscription(s).`
          : 'Found potential subscriptions. Please review and add the ones you have.'
        : 'No new subscriptions detected. You may already have all common subscriptions added.',
    });
  } catch (error) {
    console.error('Error in detectSubscriptions:', error);
    res.status(500).json({
      message: error.message || 'Failed to detect subscriptions. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Bulk import subscriptions
// @route   POST /api/subscriptions/bulk-import
// @access  Private
exports.bulkImport = async (req, res) => {
  try {
    const { subscriptions } = req.body;

    if (!Array.isArray(subscriptions) || subscriptions.length === 0) {
      return res.status(400).json({ message: 'Please provide an array of subscriptions' });
    }

    const imported = [];
    const errors = [];

    for (const sub of subscriptions) {
      try {
        // Check if subscription already exists
        const existing = await Subscription.findOne({
          user: req.user._id,
          name: sub.name,
        });

        if (existing) {
          errors.push({ name: sub.name, error: 'Already exists' });
          continue;
        }

        const subscription = await Subscription.create({
          user: req.user._id,
          name: sub.name,
          category: sub.category || 'Other',
          monthlyCost: sub.monthlyCost || 0,
          renewalDate: sub.renewalDate ? new Date(sub.renewalDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          paymentMethod: sub.paymentMethod || '',
          autoRenewal: sub.autoRenewal !== undefined ? sub.autoRenewal : true,
          currency: sub.currency || 'USD',
        });

        imported.push(subscription);
      } catch (error) {
        errors.push({ name: sub.name || 'Unknown', error: error.message });
      }
    }

    res.json({
      imported: imported.length,
      errors: errors.length,
      details: {
        imported,
        errors,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Detect from email content (for future Gmail API integration)
// @route   POST /api/subscriptions/detect-from-email
// @access  Private
exports.detectFromEmailContent = async (req, res) => {
  try {
    const { emailContent } = req.body;

    if (!emailContent) {
      return res.status(400).json({ message: 'Email content is required' });
    }

    const user = await User.findById(req.user._id);
    const detected = detectFromEmail(emailContent, user.email);

    // Filter out already existing subscriptions
    const existingSubs = await Subscription.find({ user: req.user._id });
    const existingNames = existingSubs.map(sub => sub.name.toLowerCase());

    const newDetections = detected.filter(
      sub => !existingNames.includes(sub.name.toLowerCase())
    );

    res.json({
      detected: newDetections,
      message: `Found ${newDetections.length} potential new subscriptions`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

