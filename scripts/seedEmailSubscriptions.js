const mongoose = require('mongoose');
const dotenv = require('dotenv');
const EmailSubscription = require('../models/EmailSubscription');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Sample data - Indian emails with their subscriptions (prices in INR)
const emailSubscriptionsData = [
  {
    email: 'rahul.sharma@gmail.com',
    subscriptions: [
      {
        name: 'Netflix',
        category: 'Entertainment',
        monthlyCost: 649, // INR
        renewalDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        paymentMethod: 'Credit Card',
        autoRenewal: true,
        currency: 'INR',
      },
      {
        name: 'Disney+ Hotstar',
        category: 'Entertainment',
        monthlyCost: 299,
        renewalDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
        paymentMethod: 'UPI',
        autoRenewal: true,
        currency: 'INR',
      },
      {
        name: 'Spotify Premium',
        category: 'Music',
        monthlyCost: 119,
        renewalDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        paymentMethod: 'UPI',
        autoRenewal: true,
        currency: 'INR',
      },
      {
        name: 'YouTube Premium',
        category: 'Entertainment',
        monthlyCost: 139,
        renewalDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
        paymentMethod: 'Google Pay',
        autoRenewal: true,
        currency: 'INR',
      },
    ],
  },
  {
    email: 'priya.patel@yahoo.com',
    subscriptions: [
      {
        name: 'Amazon Prime Video',
        category: 'Entertainment',
        monthlyCost: 179,
        renewalDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        paymentMethod: 'Credit Card',
        autoRenewal: true,
        currency: 'INR',
      },
      {
        name: 'Zee5',
        category: 'Entertainment',
        monthlyCost: 99,
        renewalDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
        paymentMethod: 'UPI',
        autoRenewal: true,
        currency: 'INR',
      },
      {
        name: 'Microsoft 365',
        category: 'Productivity',
        monthlyCost: 530,
        renewalDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000), // 18 days from now
        paymentMethod: 'Credit Card',
        autoRenewal: true,
        currency: 'INR',
      },
      {
        name: 'Cult.fit',
        category: 'Fitness',
        monthlyCost: 990,
        renewalDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        paymentMethod: 'UPI',
        autoRenewal: true,
        currency: 'INR',
      },
    ],
  },
  {
    email: 'arjun.kumar@outlook.com',
    subscriptions: [
      {
        name: 'JioSaavn',
        category: 'Music',
        monthlyCost: 99,
        renewalDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000), // 22 days from now
        paymentMethod: 'JioMoney',
        autoRenewal: true,
        currency: 'INR',
      },
      {
        name: 'SonyLIV',
        category: 'Entertainment',
        monthlyCost: 299,
        renewalDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        paymentMethod: 'Credit Card',
        autoRenewal: true,
        currency: 'INR',
      },
      {
        name: 'Coursera',
        category: 'Education',
        monthlyCost: 2999,
        renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        paymentMethod: 'Credit Card',
        autoRenewal: true,
        currency: 'INR',
      },
    ],
  },
  {
    email: 'ananya.singh@gmail.com',
    subscriptions: [
      {
        name: 'Netflix',
        category: 'Entertainment',
        monthlyCost: 649,
        renewalDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
        paymentMethod: 'Credit Card',
        autoRenewal: true,
        currency: 'INR',
      },
      {
        name: 'Disney+ Hotstar',
        category: 'Entertainment',
        monthlyCost: 299,
        renewalDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        paymentMethod: 'UPI',
        autoRenewal: true,
        currency: 'INR',
      },
      {
        name: 'LinkedIn Premium',
        category: 'Productivity',
        monthlyCost: 1999,
        renewalDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000), // 16 days from now
        paymentMethod: 'Credit Card',
        autoRenewal: true,
        currency: 'INR',
      },
      {
        name: 'The Times of India',
        category: 'News',
        monthlyCost: 199,
        renewalDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000), // 11 days from now
        paymentMethod: 'UPI',
        autoRenewal: true,
        currency: 'INR',
      },
      {
        name: 'Gym Membership',
        category: 'Fitness',
        monthlyCost: 2000,
        renewalDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        paymentMethod: 'Bank Account',
        autoRenewal: true,
        currency: 'INR',
      },
    ],
  },
  {
    email: 'vikram.reddy@gmail.com',
    subscriptions: [
      {
        name: 'YouTube Premium',
        category: 'Entertainment',
        monthlyCost: 139,
        renewalDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
        paymentMethod: 'Google Pay',
        autoRenewal: true,
        currency: 'INR',
      },
      {
        name: 'Google Drive (2TB)',
        category: 'Productivity',
        monthlyCost: 650,
        renewalDate: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000), // 19 days from now
        paymentMethod: 'Credit Card',
        autoRenewal: true,
        currency: 'INR',
      },
      {
        name: 'Udemy',
        category: 'Education',
        monthlyCost: 649,
        renewalDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // 28 days from now
        paymentMethod: 'Credit Card',
        autoRenewal: true,
        currency: 'INR',
      },
      {
        name: 'Jio Fiber',
        category: 'Utilities',
        monthlyCost: 999,
        renewalDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), // 9 days from now
        paymentMethod: 'JioMoney',
        autoRenewal: true,
        currency: 'INR',
      },
    ],
  },
  {
    email: 'rpremkumar2303@gmail.com',
    subscriptions: [
      {
        name: 'Netflix',
        category: 'Entertainment',
        monthlyCost: 649,
        renewalDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
        paymentMethod: 'Credit Card',
        autoRenewal: true,
        currency: 'INR',
      },
      {
        name: 'Disney+ Hotstar',
        category: 'Entertainment',
        monthlyCost: 299,
        renewalDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000), // 18 days from now
        paymentMethod: 'UPI',
        autoRenewal: true,
        currency: 'INR',
      },
      {
        name: 'Spotify Premium',
        category: 'Music',
        monthlyCost: 119,
        renewalDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        paymentMethod: 'UPI',
        autoRenewal: true,
        currency: 'INR',
      },
      {
        name: 'YouTube Premium',
        category: 'Entertainment',
        monthlyCost: 139,
        renewalDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000), // 22 days from now
        paymentMethod: 'Google Pay',
        autoRenewal: true,
        currency: 'INR',
      },
      {
        name: 'Microsoft 365',
        category: 'Productivity',
        monthlyCost: 530,
        renewalDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        paymentMethod: 'Credit Card',
        autoRenewal: true,
        currency: 'INR',
      },
    ],
  },
  {
    email: 'hpdgopinath@gmail.com',
    subscriptions: [
      {
        name: 'Amazon Prime Video',
        category: 'Entertainment',
        monthlyCost: 179,
        renewalDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
        paymentMethod: 'Credit Card',
        autoRenewal: true,
        currency: 'INR',
      },
      {
        name: 'Zee5',
        category: 'Entertainment',
        monthlyCost: 99,
        renewalDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        paymentMethod: 'UPI',
        autoRenewal: true,
        currency: 'INR',
      },
      {
        name: 'JioSaavn',
        category: 'Music',
        monthlyCost: 99,
        renewalDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
        paymentMethod: 'JioMoney',
        autoRenewal: true,
        currency: 'INR',
      },
      {
        name: 'SonyLIV',
        category: 'Entertainment',
        monthlyCost: 299,
        renewalDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000), // 11 days from now
        paymentMethod: 'Credit Card',
        autoRenewal: true,
        currency: 'INR',
      },
      {
        name: 'Cult.fit',
        category: 'Fitness',
        monthlyCost: 990,
        renewalDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        paymentMethod: 'UPI',
        autoRenewal: true,
        currency: 'INR',
      },
      {
        name: 'LinkedIn Premium',
        category: 'Productivity',
        monthlyCost: 1999,
        renewalDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
        paymentMethod: 'Credit Card',
        autoRenewal: true,
        currency: 'INR',
      },
    ],
  },
];

// Connect to MongoDB and seed data
const seedEmailSubscriptions = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/subscription-manager';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep existing data)
    await EmailSubscription.deleteMany({});
    console.log('🗑️  Cleared existing email subscriptions');

    // Insert seed data
    const result = await EmailSubscription.insertMany(emailSubscriptionsData);
    console.log(`✅ Seeded ${result.length} email subscriptions`);

    // Display summary
    console.log('\n📊 Summary:');
    for (const item of result) {
      console.log(`  - ${item.email}: ${item.subscriptions.length} subscriptions`);
    }

    console.log('\n✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

// Run the seed function
seedEmailSubscriptions();
