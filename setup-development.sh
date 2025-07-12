#!/bin/bash
# Setup script for development

set -e  # Exit on any error

echo "Setting up development environment..."

# Load development environment
echo "Loading development environment..."
if [ -f ".env.development" ]; then
    cp .env.development .env
    echo "Development environment loaded"
else
    echo "Error: .env.development file not found"
    exit 1
fi

# Start local database
echo "Starting local database..."
./start-db.sh

# Install dependencies
echo "Installing dependencies..."
npm install

# Run database migrations
echo "Running database migrations..."
npm run migration up

echo "Development environment ready!"
echo "Run 'npm run dev' to start development servers"
