const mongoose = require('mongoose');

// Pre-populated subscriptions linked to email addresses
const emailSubscriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    index: true, // Index for faster lookups
  },
  subscriptions: [
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      category: {
        type: String,
        required: true,
        enum: ['Entertainment', 'Productivity', 'Utilities', 'Education', 'Fitness', 'Music', 'News', 'Other'],
        default: 'Other',
      },
      monthlyCost: {
        type: Number,
        required: true,
        min: 0,
      },
      renewalDate: {
        type: Date,
        required: true,
      },
      paymentMethod: {
        type: String,
        trim: true,
        default: '',
      },
      autoRenewal: {
        type: Boolean,
        default: true,
      },
      currency: {
        type: String,
        default: 'USD',
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster email lookups
emailSubscriptionSchema.index({ email: 1 });

module.exports = mongoose.model('EmailSubscription', emailSubscriptionSchema);

