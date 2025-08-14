#!/bin/bash

# Build Frontend Script
echo "🏗️  Building frontend..."

# Set default FRONTEND_DIST if not provided
FRONTEND_DIST=${FRONTEND_DIST:-"dist/frontend"}

# Navigate to frontend directory
cd "$(dirname "$0")/../frontend" || exit 1

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Build the frontend
echo "🔨 Building React app..."
npm run build

# Create destination directory
DEST_DIR="../${FRONTEND_DIST}"
mkdir -p "${DEST_DIR}"

# Copy built files to destination
echo "📁 Copying build files to ${FRONTEND_DIST}..."
cp -r dist/* "${DEST_DIR}/"

echo "✅ Frontend build complete! Files copied to ${FRONTEND_DIST}"