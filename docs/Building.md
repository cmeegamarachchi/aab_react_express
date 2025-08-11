# Building Guide

This guide covers the build processes, testing, and deployment options for the Full Stack React + Express Application.

## Build Overview

The application supports multiple build strategies:
- **Master build script** (`./build.sh`) - Builds everything
- **Individual builds** - Build frontend or backend separately
- **Docker builds** - Containerized builds for deployment

## Master Build

The quickest way to build the entire application:

```bash
# Build both frontend and backend
./build.sh
```

This script:
1. Builds the React frontend using Vite
2. Builds the Express server using TypeScript compiler
3. Creates the `dist/` directory with deployable artifacts

## Individual Builds

### Frontend Build

```bash
# Build frontend only
./scripts/build-frontend.sh

# Or manually
cd frontend
npm run build
```

**Output**: `dist/frontend/` - Contains the built React SPA

### Backend Build

```bash
# Build backend only
./scripts/build-api.sh

# Or manually
cd server
npm run build
```

**Output**: `dist/api/` - Contains the compiled Express server

## Build Artifacts

After building, the `dist/` directory structure:

```
dist/
├── frontend/          # Built React application
│   ├── index.html     # Entry point
│   ├── assets/        # JS, CSS, and other assets
│   └── ...
└── api/              # Built Express server
    ├── index.js      # Main server file
    ├── api/          # Compiled API handlers
    ├── package.json  # Production dependencies
    └── node_modules/ # Installed dependencies
```

## Running Built Application

### Traditional Run

```bash
# After building
cd dist/api && npm start
```

The server will:
- Start on port 8324 (or PORT environment variable)
- Serve API requests at `/api/*`
- Serve the React SPA for all other routes

### Production Run

```bash
# Set production environment
export NODE_ENV=production
export PORT=80

# Start the server
cd dist/api && npm start
```

## Testing

### Build Testing

Test that the build process works correctly:

```bash
# Build and test
./build.sh
cd dist/api && npm start

# In another terminal, test the server
curl http://localhost:8324/api/health
curl http://localhost:8324/  # Should serve the React app
```

### Automated Testing

```bash
# Run frontend tests
cd frontend && npm test

# Run backend tests (if implemented)
cd server && npm test
```

### Health Check

The application includes a health check endpoint:

```bash
# Check if the server is running
curl http://localhost:8324/api/health

# Expected response
{"status":"ok","timestamp":"2025-08-11T..."}
```

## Environment Configuration

### Build-time Variables

Frontend build-time variables can be set in `frontend/.env`:

```bash
# Frontend environment variables
VITE_API_BASE_URL=http://localhost:8324/api
VITE_APP_NAME="Full Stack App"
```

### Runtime Variables

Server runtime variables:

```bash
# Essential variables
PORT=8324                    # Server port
NODE_ENV=production          # Environment mode
FRONTEND_DIST=dist/frontend  # Frontend files location

# Optional variables
CORS_ORIGIN=*               # CORS configuration
LOG_LEVEL=info              # Logging level
```

## Build Optimization

### Frontend Optimization

The Vite build process automatically:
- Minifies JavaScript and CSS
- Optimizes images and assets
- Generates source maps (in development)
- Creates optimized chunks for better caching

### Backend Optimization

The TypeScript build:
- Compiles to optimized JavaScript
- Removes type annotations
- Preserves source maps for debugging

### Production Optimizations

For production builds:

```bash
# Set production mode
export NODE_ENV=production

# Build with optimizations
./build.sh
```

## Deployment Preparation

### Traditional Deployment

1. **Build the application**:
   ```bash
   ./build.sh
   ```

2. **Prepare deployment package**:
   ```bash
   # Copy dist/api to your server
   rsync -av dist/api/ user@server:/path/to/deployment/
   ```

3. **Install production dependencies**:
   ```bash
   # On the target server
   cd /path/to/deployment
   npm install --production
   ```

4. **Set environment variables**:
   ```bash
   export NODE_ENV=production
   export PORT=80
   export FRONTEND_DIST=frontend
   ```

5. **Start the application**:
   ```bash
   npm start
   ```

### Process Management

For production deployments, use a process manager:

```bash
# Using PM2
npm install -g pm2
pm2 start index.js --name "aab-react-express"

# Using systemd (create service file)
sudo systemctl start aab-react-express
sudo systemctl enable aab-react-express
```

## Build Scripts Reference

### Available Scripts

```bash
./build.sh                    # Master build script
./scripts/build-frontend.sh   # Build React frontend
./scripts/build-api.sh        # Build Express backend
```

### Script Details

#### build.sh
```bash
#!/bin/bash
echo "Building frontend..."
./scripts/build-frontend.sh

echo "Building backend..."
./scripts/build-api.sh

echo "Build complete!"
```

#### build-frontend.sh
- Installs frontend dependencies
- Runs `npm run build` in frontend directory
- Copies built files to `dist/frontend/`

#### build-api.sh
- Installs backend dependencies
- Runs TypeScript compilation
- Copies files to `dist/api/`
- Installs production dependencies in `dist/api/`

## Troubleshooting Builds

### Common Build Issues

1. **TypeScript compilation errors**:
   ```bash
   # Check TypeScript configuration
   cd server && npx tsc --noEmit
   cd frontend && npx tsc --noEmit
   ```

2. **Missing dependencies**:
   ```bash
   # Reinstall dependencies
   cd frontend && rm -rf node_modules && npm install
   cd server && rm -rf node_modules && npm install
   ```

3. **Port conflicts during testing**:
   ```bash
   # Use different port
   export PORT=3001
   cd dist/api && npm start
   ```

### Build Performance

To improve build performance:

1. **Use build caching**:
   ```bash
   # Frontend build cache is automatically handled by Vite
   # Backend build cache
   cd server && npx tsc --incremental
   ```

2. **Parallel builds**:
   ```bash
   # Build frontend and backend in parallel
   ./scripts/build-frontend.sh & ./scripts/build-api.sh & wait
   ```

3. **Clean builds**:
   ```bash
   # Clean previous builds
   rm -rf dist/
   ./build.sh
   ```

## Continuous Integration

### Example CI/CD Pipeline

```yaml
# .github/workflows/build.yml
name: Build and Test
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd frontend && npm install
          cd ../server && npm install
      
      - name: Build application
        run: ./build.sh
      
      - name: Test application
        run: |
          cd dist/api && npm start &
          sleep 5
          curl -f http://localhost:8324/api/health
```
