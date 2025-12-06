#!/bin/bash

echo "🚀 Setting up Subscription Manager App..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
if [ ! -f "package.json" ]; then
    echo "❌ Backend package.json not found!"
    exit 1
fi
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
if [ ! -f "package.json" ]; then
    echo "❌ Frontend package.json not found!"
    exit 1
fi
npm install
cd ..

# Create .env files if they don't exist
echo "⚙️  Setting up environment files..."

if [ ! -f "backend/.env" ]; then
    echo "Creating backend/.env..."
    cat > backend/.env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/subscription-manager
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
JWT_EXPIRE=7d
NODE_ENV=development
EOF
    echo "✅ Created backend/.env"
else
    echo "✅ backend/.env already exists"
fi

if [ ! -f "frontend/.env" ]; then
    echo "Creating frontend/.env..."
    cat > frontend/.env << EOF
REACT_APP_API_URL=http://localhost:5000/api
EOF
    echo "✅ Created frontend/.env"
else
    echo "✅ frontend/.env already exists"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Make sure MongoDB is running (or use MongoDB Atlas)"
echo "2. Update backend/.env with your MongoDB connection string if needed"
echo "3. Open two terminals:"
echo "   Terminal 1: cd backend && npm start"
echo "   Terminal 2: cd frontend && npm start"
echo ""
echo "🌐 App will be available at http://localhost:3000"

