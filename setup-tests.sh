#!/bin/bash
# Installation and Test Running Script
# Run this file to setup and run tests

echo "🚀 Prep Pilot Unit Testing Setup"
echo "================================"
echo ""

# Step 1: Install dependencies
echo "📦 Step 1: Installing dependencies..."
echo "Command: npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom @vitejs/plugin-react"
echo ""
echo "Run this in your terminal:"
echo "npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom @vitejs/plugin-react"
echo ""

# Step 2: Package.json update
echo "📝 Step 2: Update package.json"
echo "Add these scripts to your package.json:"
echo ""
cat << 'EOF'
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
EOF
echo ""

# Step 3: Run tests
echo "🧪 Step 3: Run tests"
echo "Command: npm test"
echo ""

# Step 4: View UI
echo "🎨 Step 4: View test UI (optional)"
echo "Command: npm run test:ui"
echo ""

# Step 5: Check coverage
echo "📊 Step 5: Check coverage (optional)"
echo "Command: npm run test:coverage"
echo ""

echo "================================"
echo "✅ Setup Complete!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Copy and paste the npm install command above"
echo "2. Update your package.json with test scripts"
echo "3. Run: npm test"
echo "4. Read: __tests__/README.md"
echo ""
