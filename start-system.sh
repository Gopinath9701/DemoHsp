#!/bin/bash

# MediPulse Lab Suite - Mac/Linux Startup Script
# This script starts both backend and frontend servers

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     MediPulse Lab Suite - System Startup                   ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
echo "🔍 Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js found: $NODE_VERSION"
else
    echo "❌ Node.js not found! Please install Node.js v18+"
    exit 1
fi

echo ""

# Check if .env file exists
echo "🔍 Checking backend configuration..."
if [ -f "backend/.env" ]; then
    echo "✅ backend/.env found"
    if grep -q "DATABASE_URL" backend/.env; then
        echo "✅ DATABASE_URL configured"
    else
        echo "⚠️  WARNING: DATABASE_URL not set in .env file"
        echo "   Please update backend/.env with your Neon connection string"
    fi
else
    echo "❌ backend/.env not found!"
    exit 1
fi

echo ""

# Start backend in a new terminal
echo "🚀 Starting Backend Server (Port 5000)..."
echo "   (New window will open for logs)"
echo ""

if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open -a Terminal <<EOF
cd "$(pwd)/backend" && npm start
EOF
else
    # Linux
    gnome-terminal -- bash -c "cd '$(pwd)/backend' && npm start; bash" &
fi

# Wait a bit for backend to start
sleep 3

# Start frontend in another new terminal
echo "🚀 Starting Frontend Server (Port 5173)..."
echo "   (Another window will open)"
echo ""

if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open -a Terminal <<EOF
cd "$(pwd)/frontend" && npm run dev
EOF
else
    # Linux
    gnome-terminal -- bash -c "cd '$(pwd)/frontend' && npm run dev; bash" &
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║     ✅ MediPulse Lab Suite Started Successfully!          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

echo "📋 System Status:"
echo "   • Backend API:  http://localhost:5000"
echo "   • Dashboard:    http://localhost:5173"
echo ""

echo "🎯 Next Steps:"
echo "   1. Two terminal windows should now be open"
echo "   2. Open http://localhost:5173 in your browser"
echo "   3. Start with the Landing (Home) tab"
echo "   4. Use TESTING_CHECKLIST.md to verify all features"
echo ""

echo "💡 Tips:"
echo "   • Keep both terminal windows open while testing"
echo "   • Check backend terminal for connection logs"
echo "   • If you see errors, read SETUP_INSTRUCTIONS.md"
echo "   • Press Ctrl+C in either terminal to stop the server"
echo ""

echo "📚 Documentation:"
echo "   • README.md - Complete system overview"
echo "   • SETUP_INSTRUCTIONS.md - Step-by-step setup"
echo "   • TESTING_CHECKLIST.md - Full testing guide"
echo ""
