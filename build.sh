#!/bin/bash

# Master Build Script
echo "🚀 Building Full Stack Application..."

# Build frontend first
echo "Step 1: Building frontend..."
./scripts/build-frontend.sh

# Build API
echo "Step 2: Building API..."
./scripts/build-api.sh

echo "✅ Full stack build complete!"
echo "📂 Frontend: dist/frontend"
echo "📂 API: dist/api"
echo "🏃 To run: cd dist/api && npm start"
echo ""
echo "🐳 For Docker deployment:"
echo "   ./scripts/docker-build-export.sh"
