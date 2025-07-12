#!/bin/bash

cd "$(dirname "$0")"

echo "Starting PostgreSQL database..."

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

# Start the services defined in docker-compose.yml in detached mode
if docker compose -f .devcontainer/docker-compose.yml up db -d; then
    echo "Database is up and running!"
else
    echo "Failed to start database."
    exit 1
fi