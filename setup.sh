#!/bin/bash

# StoryMind AI - First Time Setup Helper
# This script helps with initial configuration

echo "🚀 StoryMind AI - Initial Setup"
echo "=================================="
echo ""

# Check if .env.local exists
if [ -f .env.local ]; then
    echo "✅ .env.local file found"
    echo ""
    echo "Database Setup Instructions:"
    echo "1. Ensure your PostgreSQL database is running"
    echo "2. Run: npx prisma migrate dev --name init"
    echo ""
else
    echo "❌ .env.local not found!"
    echo ""
    echo "Setting up environment..."
    cp .env.example .env.local
    echo "✅ Created .env.local from template"
    echo ""
    echo "⚠️  NEXT STEPS:"
    echo "1. Edit .env.local with your values:"
    echo "   - DATABASE_URL: Your PostgreSQL connection string"
    echo "   - NEXTAUTH_SECRET: Generate with: openssl rand -base64 32"
    echo "   - NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY: From Google AI Studio"
    echo ""
    echo "2. Then run:"
    echo "   $ npx prisma migrate dev --name init"
    echo "   $ npm run dev"
    echo ""
fi

echo "For detailed setup, see QUICKSTART.md"
