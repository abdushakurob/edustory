#!/bin/bash

# StoryMind AI - Quick Setup Script
# Run: bash scripts/setup.sh

echo "🚀 StoryMind AI - Setup Script"
echo "================================"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

echo "✓ Node.js $(node -v)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found"
    exit 1
fi

echo "✓ npm $(npm -v)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Create uploads directory
echo ""
echo "📁 Creating upload directories..."
mkdir -p public/uploads

# Check for .env.local
echo ""
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found!"
    echo ""
    echo "   Copy .env.example to .env.local:"
    echo "   $ cp .env.example .env.local"
    echo ""
    echo "   Then edit with your values:"
    echo "   - DATABASE_URL"
    echo "   - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)"
    echo "   - NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY"
    echo ""
else
    echo "✓ .env.local configured"
fi

# Generate Prisma Client
echo ""
echo "🔧 Generating Prisma Client..."
npx prisma generate

echo ""
echo "================================"
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure .env.local (if not done)"
echo "2. Run database migrations:"
echo "   $ npx prisma migrate dev --name init"
echo "3. Start development server:"
echo "   $ npm run dev"
echo ""
echo "Visit http://localhost:3000 🎉"
