const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide a subscription name'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['Entertainment', 'Productivity', 'Utilities', 'Education', 'Fitness', 'Music', 'News', 'Other'],
    default: 'Other',
  },
  monthlyCost: {
    type: Number,
    required: [true, 'Please provide a monthly cost'],
    min: 0,
  },
  renewalDate: {
    type: Date,
    required: [true, 'Please provide a renewal date'],
  },
  paymentMethod: {
    type: String,
    trim: true,
  },
  autoRenewal: {
    type: Boolean,
    default: true,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Subscription', subscriptionSchema);

