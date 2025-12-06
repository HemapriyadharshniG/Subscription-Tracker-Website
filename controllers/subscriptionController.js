const Subscription = require('../models/Subscription');

// @desc    Get all subscriptions for a user
// @route   GET /api/subscriptions
// @access  Private
exports.getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user._id }).sort({ renewalDate: 1 });
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single subscription
// @route   GET /api/subscriptions/:id
// @access  Private
exports.getSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Make sure subscription belongs to user
    if (subscription.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new subscription
// @route   POST /api/subscriptions
// @access  Private
exports.createSubscription = async (req, res) => {
  try {
    const { name, category, monthlyCost, renewalDate, paymentMethod, autoRenewal, currency } = req.body;

    const subscription = await Subscription.create({
      user: req.user._id,
      name,
      category,
      monthlyCost,
      renewalDate,
      paymentMethod,
      autoRenewal: autoRenewal !== undefined ? autoRenewal : true,
      currency: currency || 'INR',
    });

    res.status(201).json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update subscription
// @route   PUT /api/subscriptions/:id
// @access  Private
exports.updateSubscription = async (req, res) => {
  try {
    let subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Make sure subscription belongs to user
    if (subscription.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    subscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete subscription
// @route   DELETE /api/subscriptions/:id
// @access  Private
exports.deleteSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Make sure subscription belongs to user
    if (subscription.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await subscription.deleteOne();
    res.json({ message: 'Subscription removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get subscription analytics
// @route   GET /api/subscriptions/analytics/summary
// @access  Private
exports.getAnalytics = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user._id });

    // Calculate totals
    const totalMonthly = subscriptions.reduce((sum, sub) => sum + sub.monthlyCost, 0);
    const totalYearly = totalMonthly * 12;

    // Category breakdown
    const categoryBreakdown = {};
    subscriptions.forEach(sub => {
      categoryBreakdown[sub.category] = (categoryBreakdown[sub.category] || 0) + sub.monthlyCost;
    });

    // Top subscriptions by cost
    const topSubscriptions = [...subscriptions]
      .sort((a, b) => b.monthlyCost - a.monthlyCost)
      .slice(0, 5)
      .map(sub => ({
        name: sub.name,
        cost: sub.monthlyCost,
        category: sub.category,
      }));

    // Upcoming renewals (next 30 days)
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const upcomingRenewals = subscriptions
      .filter(sub => {
        const renewalDate = new Date(sub.renewalDate);
        return renewalDate >= now && renewalDate <= thirtyDaysFromNow;
      })
      .sort((a, b) => new Date(a.renewalDate) - new Date(b.renewalDate))
      .map(sub => ({
        name: sub.name,
        renewalDate: sub.renewalDate,
        cost: sub.monthlyCost,
      }));

    res.json({
      totalMonthly,
      totalYearly,
      categoryBreakdown,
      topSubscriptions,
      upcomingRenewals,
      totalSubscriptions: subscriptions.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

