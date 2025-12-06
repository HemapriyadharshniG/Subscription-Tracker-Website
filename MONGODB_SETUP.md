# MongoDB Setup Guide

## Option 1: MongoDB Atlas (Cloud - Recommended) ⭐

This is the easiest option - no installation required!

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for a free account (or log in if you have one)

### Step 2: Create a Free Cluster
1. Click "Build a Database"
2. Choose "FREE" (M0) tier
3. Select a cloud provider and region (choose closest to you)
4. Click "Create"

### Step 3: Create Database User
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Enter a username and password (save these!)
5. Set privileges to "Atlas admin" or "Read and write to any database"
6. Click "Add User"

### Step 4: Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development) or add your IP
4. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
5. Replace `<password>` with your database user password
6. Add database name at the end: `...mongodb.net/subscription-manager`

### Step 6: Update Backend Configuration
Update `backend/.env`:
```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/subscription-manager?retryWrites=true&w=majority
```

### Step 7: Restart Backend
```bash
cd backend
npm start
```

You should see: `✅ MongoDB Connected: ...`

---

## Option 2: Local MongoDB Installation

### macOS Installation

#### Step 1: Install MongoDB
```bash
# Add MongoDB tap
brew tap mongodb/brew

# Install MongoDB Community Edition
brew install mongodb-community
```

#### Step 2: Start MongoDB
```bash
# Start MongoDB as a service
brew services start mongodb-community

# Or start manually
mongod --config /usr/local/etc/mongod.conf
```

#### Step 3: Verify Installation
```bash
# Check if MongoDB is running
brew services list | grep mongodb

# Or test connection
mongosh
```

#### Step 4: Update Backend Configuration
Your `backend/.env` should already have:
```env
MONGODB_URI=mongodb://localhost:27017/subscription-manager
```

#### Step 5: Restart Backend
```bash
cd backend
npm start
```

---

## Verify MongoDB Connection

Test the connection:
```bash
cd backend
node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => { console.log('✅ MongoDB Connected!'); process.exit(0); }).catch(e => { console.log('❌ Failed:', e.message); process.exit(1); });"
```

---

## Troubleshooting

### Connection Timeout
- Check your internet connection (for Atlas)
- Verify IP address is whitelisted (for Atlas)
- Check MongoDB service is running (for local)

### Authentication Failed
- Verify username and password in connection string
- Make sure password doesn't contain special characters (or URL-encode them)

### Port Already in Use (Local)
```bash
# Find and kill process
lsof -ti:27017 | xargs kill -9
```

---

## Quick Start (Atlas)

1. Sign up: https://www.mongodb.com/cloud/atlas/register
2. Create free cluster
3. Create database user
4. Allow access from anywhere
5. Get connection string
6. Update `backend/.env` with connection string
7. Restart backend

Done! 🎉

