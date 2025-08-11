#!/bin/bash

# Docker Test Script
# Tests the Docker build and basic functionality

set -e

echo "🧪 Testing Docker Build..."
echo "========================="

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "${SCRIPT_DIR}")"

cd "${PROJECT_ROOT}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Clean up any existing test containers
echo "🧹 Cleaning up any existing test containers..."
docker rm -f aab-test-container 2>/dev/null || true

# Build the image
echo "🔨 Building Docker image for testing..."
docker build -t aab-react-express:test .

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed!"
    exit 1
fi

# Run the container in the background
echo "🚀 Starting test container..."
docker run -d -p 8325:8324 --name aab-test-container aab-react-express:test

# Wait for container to be ready
echo "⏳ Waiting for container to start..."
sleep 10

# Test health endpoint
echo "🔍 Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s http://localhost:8325/api/health || echo "FAILED")

if [[ $HEALTH_RESPONSE == *"OK"* ]]; then
    echo "✅ Health endpoint test passed!"
else
    echo "❌ Health endpoint test failed!"
    echo "Response: $HEALTH_RESPONSE"
    docker logs aab-test-container
    docker rm -f aab-test-container
    exit 1
fi

# Test frontend serving (should return HTML)
echo "🌐 Testing frontend serving..."
FRONTEND_RESPONSE=$(curl -s http://localhost:8325/ | head -c 100)

if [[ $FRONTEND_RESPONSE == *"<html"* ]] || [[ $FRONTEND_RESPONSE == *"<!DOCTYPE"* ]]; then
    echo "✅ Frontend serving test passed!"
else
    echo "❌ Frontend serving test failed!"
    echo "Response: $FRONTEND_RESPONSE"
    docker logs aab-test-container
    docker rm -f aab-test-container
    exit 1
fi

# Clean up
echo "🧹 Cleaning up test container..."
docker rm -f aab-test-container

# Clean up test image
docker rmi aab-react-express:test

echo ""
echo "🎉 All Docker tests passed successfully!"
echo "✅ Docker image builds correctly"
echo "✅ Health endpoint works"
echo "✅ Frontend is served correctly"
echo ""
echo "Ready to use: ./scripts/docker-build-export.sh"
