#!/bin/bash

# ClearSkyIQ Harmony API Docker Build Script

set -e

echo "Building ClearSkyIQ Harmony API Docker image..."

# Build the Docker image
docker build -t ${dockerhub_username}/clearskyiq-harmony-api:latest .

echo "Docker image built successfully!"
echo "Image: ${dockerhub_username}/clearskyiq-harmony-api:latest"

# Show image details
echo ""
echo "Image details:"
docker images ${dockerhub_username}/clearskyiq-harmony-api:latest

echo ""
echo "To run the container locally:"
echo "  docker run -p 8000:8000 --env-file env.docker ${dockerhub_username}/clearskyiq-harmony-api:latest"
echo ""
echo "Or use docker-compose:"
echo "  docker-compose up -d"
echo ""
echo "To push to Docker Hub:"
echo "  docker push ${dockerhub_username}/clearskyiq-harmony-api:latest"
echo ""
echo "To tag and push specific version:"
echo "  docker tag ${dockerhub_username}/clearskyiq-harmony-api:latest ${dockerhub_username}/clearskyiq-harmony-api:v1.0.0"
echo "  docker push ${dockerhub_username}/clearskyiq-harmony-api:v1.0.0"
