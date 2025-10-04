#!/bin/bash

# Harmony API Startup Script

echo "🚀 Starting Harmony API..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install/update dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Please copy env.example to .env and configure your credentials."
    echo "   cp env.example .env"
    echo "   # Then edit .env with your NASA Earthdata credentials"
    exit 1
fi

# Start the API
echo "🌍 Starting Harmony API server..."
python main.py

