# Email-Based Subscription Database (India)

## Overview

The app now includes a pre-populated database of Indian email addresses with their associated subscriptions. When a user signs up with one of these email addresses, their subscriptions are automatically imported. All prices are in Indian Rupees (INR).

## Pre-populated Email Addresses

The following email addresses have subscriptions in the database:

### 1. rahul.sharma@gmail.com
- Netflix (₹649/month)
- Disney+ Hotstar (₹299/month)
- Spotify Premium (₹119/month)
- YouTube Premium (₹139/month)

### 2. priya.patel@yahoo.com
- Amazon Prime Video (₹179/month)
- Zee5 (₹99/month)
- Microsoft 365 (₹530/month)
- Cult.fit (₹990/month)

### 3. arjun.kumar@outlook.com
- JioSaavn (₹99/month)
- SonyLIV (₹299/month)
- Coursera (₹2999/month)

### 4. ananya.singh@gmail.com
- Netflix (₹649/month)
- Disney+ Hotstar (₹299/month)
- LinkedIn Premium (₹1999/month)
- The Times of India (₹199/month)
- Gym Membership (₹2000/month)

### 5. vikram.reddy@gmail.com
- YouTube Premium (₹139/month)
- Google Drive 2TB (₹650/month)
- Udemy (₹649/month)
- Jio Fiber (₹999/month)

### 6. rpremkumar2303@gmail.com
- Netflix (₹649/month)
- Disney+ Hotstar (₹299/month)
- Spotify Premium (₹119/month)
- YouTube Premium (₹139/month)
- Microsoft 365 (₹530/month)

### 7. hpdgopinath@gmail.com
- Amazon Prime Video (₹179/month)
- Zee5 (₹99/month)
- JioSaavn (₹99/month)
- SonyLIV (₹299/month)
- Cult.fit (₹990/month)
- LinkedIn Premium (₹1999/month)

## How It Works

1. **Signup**: When a user signs up with one of the pre-populated email addresses, the system automatically:
   - Creates the user account
   - Checks the email subscription database
   - Imports all subscriptions linked to that email (in INR)
   - Redirects to dashboard with subscriptions already loaded

2. **Detection**: The "Detect Subscriptions" feature also checks the email database and shows:
   - Subscriptions linked to the user's email (with full details in INR)
   - Common Indian subscription services (Hotstar, Zee5, JioSaavn, etc.)

## Indian Subscription Services Included

The detection feature recognizes popular Indian services:
- **Entertainment**: Netflix, Disney+ Hotstar, Amazon Prime Video, Zee5, SonyLIV, Voot, Airtel Xstream
- **Music**: Spotify Premium, JioSaavn, Apple Music, YouTube Premium
- **Productivity**: Microsoft 365, Adobe Creative Cloud, Google Drive, Dropbox, LinkedIn Premium
- **Fitness**: Gym Membership, Cult.fit
- **Education**: Coursera, Udemy, Byju's
- **News**: The Times of India, The Hindu
- **Utilities**: Jio Fiber

## Testing

To test the feature:

1. **Sign up with a pre-populated email:**
   ```
   Email: rpremkumar2303@gmail.com (or hpdgopinath@gmail.com)
   Name: (any name)
   Password: (any password)
   ```

2. After signup, you should see all subscriptions automatically imported on the dashboard with prices in ₹ (INR).
   - rpremkumar2303@gmail.com: 5 subscriptions
   - hpdgopinath@gmail.com: 6 subscriptions

3. **Use "Detect Subscriptions"** to see email-linked subscriptions appear first in the list with Indian services.

## Adding More Email Subscriptions

To add more email addresses with subscriptions:

1. Edit `backend/scripts/seedEmailSubscriptions.js`
2. Add new entries to the `emailSubscriptionsData` array
3. Use Indian pricing (INR) and Indian services
4. Run the seed script:
   ```bash
   cd backend
   npm run seed:emails
   ```

## Database Structure

The `EmailSubscription` model stores:
- Email address (indexed for fast lookups)
- Array of subscription objects with:
  - Name
  - Category
  - Monthly cost (in INR)
  - Renewal date
  - Payment method (UPI, Credit Card, etc.)
  - Auto-renewal status
  - Currency (INR)

## Payment Methods

Common Indian payment methods included:
- UPI (Unified Payments Interface)
- Credit Card
- Debit Card
- Google Pay
- PhonePe
- Paytm
- JioMoney
- Bank Account

## API Endpoints

- **Signup** (`POST /api/auth/signup`): Automatically imports subscriptions if email exists in database
- **Detect** (`POST /api/subscriptions/detect`): Returns email-linked subscriptions + Indian service suggestions

## Notes

- Email matching is case-insensitive
- Duplicate subscriptions are automatically filtered
- Subscription import happens silently during signup
- If import fails, signup still succeeds (error is logged)
- All default currency is INR (₹)
- Prices reflect typical Indian market rates
