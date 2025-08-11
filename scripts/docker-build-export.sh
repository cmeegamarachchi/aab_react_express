#!/bin/bash

# Docker Build and Export Script
# Builds the Docker image and exports it as a tar file for distribution

set -e  # Exit on any error

# Configuration
IMAGE_NAME="aab-react-express"
IMAGE_TAG="latest"
EXPORT_FILE="aab-react-express-${IMAGE_TAG}.tar"

echo "🐳 Docker Build and Export Script"
echo "=================================="

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "${SCRIPT_DIR}")"

cd "${PROJECT_ROOT}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "📂 Building from directory: ${PROJECT_ROOT}"
echo "🏷️  Image name: ${IMAGE_NAME}:${IMAGE_TAG}"

# Build the Docker image
echo ""
echo "🔨 Building Docker image..."
docker build -t "${IMAGE_NAME}:${IMAGE_TAG}" .

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed!"
    exit 1
fi

echo ""
echo "✅ Docker image built successfully!"

# Get image info
IMAGE_SIZE=$(docker images "${IMAGE_NAME}:${IMAGE_TAG}" --format "table {{.Size}}" | tail -n 1)
IMAGE_ID=$(docker images "${IMAGE_NAME}:${IMAGE_TAG}" --format "table {{.ID}}" | tail -n 1)

echo "📊 Image ID: ${IMAGE_ID}"
echo "📏 Image Size: ${IMAGE_SIZE}"

# Export the image to tar file
echo ""
echo "📦 Exporting Docker image to ${EXPORT_FILE}..."
docker save -o "${EXPORT_FILE}" "${IMAGE_NAME}:${IMAGE_TAG}"

if [ $? -ne 0 ]; then
    echo "❌ Docker export failed!"
    exit 1
fi

# Get file size
EXPORT_SIZE=$(ls -lh "${EXPORT_FILE}" | awk '{print $5}')

echo ""
echo "✅ Docker export complete!"
echo "📁 Export file: ${EXPORT_FILE}"
echo "📏 File size: ${EXPORT_SIZE}"
echo ""

# Display usage instructions
echo "🚀 Usage Instructions:"
echo "======================"
echo ""
echo "To load the image on another machine:"
echo "  docker load -i ${EXPORT_FILE}"
echo ""
echo "To run the container:"
echo "  docker run -d -p 8324:8324 --name aab-app ${IMAGE_NAME}:${IMAGE_TAG}"
echo ""
echo "To run with custom port:"
echo "  docker run -d -p 3000:8324 --name aab-app ${IMAGE_NAME}:${IMAGE_TAG}"
echo ""
echo "To run with environment variables:"
echo "  docker run -d -p 8324:8324 -e NODE_ENV=production --name aab-app ${IMAGE_NAME}:${IMAGE_TAG}"
echo ""
echo "To access the application:"
echo "  Frontend: http://localhost:8324"
echo "  API: http://localhost:8324/api/health"
echo ""
echo "Container management:"
echo "  docker logs aab-app        # View logs"
echo "  docker stop aab-app        # Stop container"
echo "  docker start aab-app       # Start stopped container"
echo "  docker rm aab-app          # Remove container"
echo ""
echo "🎉 Build and export completed successfully!"
