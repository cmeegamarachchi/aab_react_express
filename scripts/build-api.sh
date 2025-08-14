#!/bin/bash

# Build API Script
echo "🏗️  Building TypeScript API server..."

# Navigate to server directory
cd "$(dirname "$0")/../server" || exit 1

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing server dependencies..."
    npm install
fi

# Build TypeScript to JavaScript
echo "🔨 Compiling TypeScript..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ TypeScript compilation failed!"
    exit 1
fi

# Create destination directory
DEST_DIR="../dist/api"
mkdir -p "${DEST_DIR}"

# Copy compiled JavaScript files to destination
echo "📁 Copying compiled files to dist/api..."
cp -r dist/* "${DEST_DIR}/"

# Copy package.json and update the main entry point
echo "📝 Updating package.json for production..."
sed 's/"main": "dist\/index.js"/"main": "index.js"/' package.json > "${DEST_DIR}/package.json"
sed -i 's/"start": "node dist\/index.js"/"start": "node index.js"/' "${DEST_DIR}/package.json"
if [ -f ".env" ]; then
    cp .env "${DEST_DIR}/"
fi

# Install production dependencies in destination
cd "${DEST_DIR}" || exit 1
echo "📦 Installing production dependencies..."
npm install --production

echo "✅ TypeScript API build complete! Compiled server files copied to dist/api"