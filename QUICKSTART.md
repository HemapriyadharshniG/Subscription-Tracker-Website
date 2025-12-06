# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

```bash
# Install all dependencies (backend + frontend)
npm run install-all

# Or install separately:
cd backend && npm install
cd ../frontend && npm install
```

### Step 2: Set Up MongoDB

**Option A: Local MongoDB**
- Install MongoDB locally
- Start MongoDB service
- Use connection string: `mongodb://localhost:27017/subscription-manager`

**Option B: MongoDB Atlas (Cloud - Recommended)**
- Create free account at https://www.mongodb.com/cloud/atlas
- Create a cluster
- Get connection string
- Use it in backend `.env` file

### Step 3: Configure Environment Variables

**Backend** (`backend/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/subscription-manager
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d
NODE_ENV=development
```

**Frontend** (`frontend/.env`):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 4: Start the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm start
# App opens at http://localhost:3000
```

### Step 5: Create Your Account

1. Open http://localhost:3000
2. Click "Sign up"
3. Fill in your details
4. Start adding subscriptions!

## ✅ That's it! You're ready to go!

## 📝 First Steps After Login

1. **Add Subscriptions**: Click "+ Add Subscription" on the dashboard
2. **View Analytics**: Check the Analytics page for spending insights
3. **Customize Settings**: Adjust theme and preferences in Settings

## 🐛 Common Issues

**MongoDB Connection Error:**
- Make sure MongoDB is running (if local)
- Check your connection string in `.env`
- Verify network access (if using Atlas)

**Port Already in Use:**
- Change `PORT` in backend `.env`
- Update `REACT_APP_API_URL` in frontend `.env` accordingly

**CORS Errors:**
- Ensure backend is running before frontend
- Check that API URL in frontend `.env` matches backend URL

## 📚 Need More Help?

Check the main [README.md](README.md) for detailed documentation.

