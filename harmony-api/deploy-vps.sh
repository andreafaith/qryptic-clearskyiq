#!/bin/bash

# ClearSkyIQ Harmony API VPS Deployment Script
# This script deploys the Docker image from DockerHub to your VPS

set -e

echo "Deploying ClearSkyIQ Harmony API to VPS..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp env.docker .env
    echo "Please edit .env file with your NASA Earthdata credentials before running again."
    exit 1
fi

# Pull the latest image from DockerHub
echo "Pulling latest image from DockerHub..."
docker pull ${dockerhub_username}/clearskyiq-harmony-api:latest

# Stop existing container if running
echo "Stopping existing container..."
docker-compose -f docker-compose.prod.yml down || true

# Start the new container
echo "Starting new container with persistent storage..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for container to be healthy
echo "Waiting for container to be healthy..."
sleep 10

# Check container status
echo "Container status:"
docker-compose -f docker-compose.prod.yml ps

# Show logs
echo "Recent logs:"
docker-compose -f docker-compose.prod.yml logs --tail=20

echo ""
echo "Deployment complete!"
echo "API is available at: http://your-vps-ip:8000"
echo "Health check: http://your-vps-ip:8000/health"
echo "API docs: http://your-vps-ip:8000/docs"
echo ""
echo "To view logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "To stop: docker-compose -f docker-compose.prod.yml down"
echo "To restart: docker-compose -f docker-compose.prod.yml restart"
