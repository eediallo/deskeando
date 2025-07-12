#!/bin/bash
# Deploy script for production

set -e  # Exit on any error

echo "Starting production deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found. Run this script from the project root."
    exit 1
fi

# Load production environment
echo "Loading production environment..."
if [ -f ".env.production" ]; then
    cp .env.production .env
    echo "Production environment loaded"
else
    echo "Error: .env.production file not found"
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm ci --only=production

# Build the frontend
echo "Building frontend..."
npm run build

# Run database migrations
echo "Running database migrations..."
npm run migration up

# Start the application
echo "Starting application..."
npm start
