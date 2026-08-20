# MediPulse Lab Suite - Windows PowerShell Startup Script
# This script starts both backend and frontend servers

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     MediPulse Lab Suite - System Startup                   ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "🔍 Checking Node.js installation..." -ForegroundColor Yellow
$nodeVersion = node --version
if ($nodeVersion) {
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js not found! Please install Node.js v18+" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Check if .env file exists
Write-Host "🔍 Checking backend configuration..." -ForegroundColor Yellow
if (Test-Path "backend\.env") {
    Write-Host "✅ backend\.env found" -ForegroundColor Green
    $envContent = Get-Content "backend\.env" -Raw
    if ($envContent -match "DATABASE_URL") {
        Write-Host "✅ DATABASE_URL configured" -ForegroundColor Green
    } else {
        Write-Host "⚠️  WARNING: DATABASE_URL not set in .env file" -ForegroundColor Yellow
        Write-Host "   Please update backend\.env with your Neon connection string" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ backend\.env not found!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Start backend
Write-Host "🚀 Starting Backend Server (Port 5000)..." -ForegroundColor Cyan
Write-Host "   (Keeping this window open for logs)" -ForegroundColor Gray
Write-Host ""

$backendProcess = Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd backend; npm start" -PassThru -WindowStyle Normal

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start frontend
Write-Host "🚀 Starting Frontend Server (Port 5173)..." -ForegroundColor Cyan
Write-Host "   (New window will open)" -ForegroundColor Gray
Write-Host ""

$frontendProcess = Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev" -PassThru -WindowStyle Normal

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║     ✅ MediPulse Lab Suite Started Successfully!          ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Write-Host "📋 System Status:" -ForegroundColor Cyan
Write-Host "   • Backend API:  http://localhost:5000" -ForegroundColor White
Write-Host "   • Dashboard:    http://localhost:5173" -ForegroundColor White
Write-Host ""

Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Two terminal windows should now be open" -ForegroundColor White
Write-Host "   2. Open http://localhost:5173 in your browser" -ForegroundColor White
Write-Host "   3. Start with the Landing (Home) tab" -ForegroundColor White
Write-Host "   4. Use TESTING_CHECKLIST.md to verify all features" -ForegroundColor White
Write-Host ""

Write-Host "💡 Tips:" -ForegroundColor Cyan
Write-Host "   • Keep both terminal windows open while testing" -ForegroundColor White
Write-Host "   • Check backend terminal for connection logs" -ForegroundColor White
Write-Host "   • If you see errors, read SETUP_INSTRUCTIONS.md" -ForegroundColor White
Write-Host "   • Press Ctrl+C in either terminal to stop the server" -ForegroundColor White
Write-Host ""

Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "   • README.md - Complete system overview" -ForegroundColor White
Write-Host "   • SETUP_INSTRUCTIONS.md - Step-by-step setup" -ForegroundColor White
Write-Host "   • TESTING_CHECKLIST.md - Full testing guide" -ForegroundColor White
Write-Host ""

# Wait for both processes to close
Wait-Process -Id $backendProcess.Id, $frontendProcess.Id
