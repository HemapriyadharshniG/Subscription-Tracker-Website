# Troubleshooting Guide

## ❌ Cannot Login - Common Issues & Solutions

### Issue 1: MongoDB Not Running

**Symptoms:**
- Login fails with connection errors
- Backend shows "MongoDB Connection Error"
- Error: `ECONNREFUSED 127.0.0.1:27017`

**Solution:**

**Option A: Start Local MongoDB**
```bash
# macOS (using Homebrew)
brew services start mongodb-community

# Check if it's running
brew services list | grep mongodb

# Or start manually
mongod --config /usr/local/etc/mongod.conf
```

**Option B: Use MongoDB Atlas (Cloud - Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a free cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Update `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/subscription-manager
   ```

### Issue 2: Backend Not Running

**Symptoms:**
- Error: "Cannot connect to server"
- Frontend shows connection errors

**Solution:**
```bash
# Check if backend is running
lsof -ti:5000

# If not running, start it:
cd backend
npm start

# You should see:
# Server running on port 5000
# ✅ MongoDB Connected: ...
```

### Issue 3: Frontend Not Running

**Symptoms:**
- Can't access http://localhost:3000
- Page won't load

**Solution:**
```bash
# Start frontend
cd frontend
npm start

# Should automatically open http://localhost:3000
```

### Issue 4: No Account Created

**Symptoms:**
- Login fails with "Invalid email or password"
- You haven't signed up yet

**Solution:**
1. Go to http://localhost:3000
2. Click "Sign up" (not Login)
3. Create an account first
4. Then you can login

### Issue 5: CORS Errors

**Symptoms:**
- Browser console shows CORS errors
- Network requests fail

**Solution:**
- Make sure backend is running BEFORE frontend
- Check that `REACT_APP_API_URL` in `frontend/.env` matches backend URL
- Backend should have CORS enabled (already configured)

### Issue 6: Port Already in Use

**Symptoms:**
- Error: "Port 5000 is already in use"
- Backend won't start

**Solution:**
```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in backend/.env:
PORT=5001

# Then update frontend/.env:
REACT_APP_API_URL=http://localhost:5001/api
```

## 🔍 Quick Diagnostic Commands

```bash
# Check if MongoDB is running
brew services list | grep mongodb
# or
ps aux | grep mongod

# Check if backend is running
curl http://localhost:5000/api/health

# Check if frontend is running
curl http://localhost:3000

# Test MongoDB connection
cd backend
node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => { console.log('✅ Connected'); process.exit(0); }).catch(e => { console.log('❌ Failed:', e.message); process.exit(1); });"
```

## 📝 Step-by-Step Fix for Login Issues

1. **Check MongoDB:**
   ```bash
   brew services start mongodb-community
   ```

2. **Restart Backend:**
   ```bash
   cd backend
   npm start
   ```
   Wait for: `✅ MongoDB Connected`

3. **Restart Frontend:**
   ```bash
   cd frontend
   npm start
   ```

4. **Create Account:**
   - Go to http://localhost:3000
   - Click "Sign up"
   - Fill in details
   - Submit

5. **Login:**
   - Use the email and password you just created

## 🆘 Still Having Issues?

1. Check browser console (F12) for errors
2. Check backend terminal for error messages
3. Verify all environment variables are set correctly
4. Make sure you're using the correct email/password
5. Try clearing browser localStorage:
   ```javascript
   localStorage.clear()
   ```

