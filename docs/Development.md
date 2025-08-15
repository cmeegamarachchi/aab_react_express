# Development Guide

This guide covers the development environment setup and workflow for the Full Stack React + Express Application.

## Development Environment

This project is built with **TypeScript** throughout the stack and designed to run in **VS Code** using **devcontainer technology**. The devcontainer ensures a consistent development environment with all necessary tools and dependencies pre-configured.

## Prerequisites

- **VS Code** with the Dev Containers extension
- **Docker** (for devcontainer support and containerized deployment)
- **Git** (for version control)

## Getting Started

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd aab_react_express
   ```

2. Open in VS Code
   ```bash
   code .
   ```

3. VS Code will prompt to "Reopen in Container" - click yes
4. The devcontainer will automatically set up the development environment

## Development Workflow

### Frontend Development

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already installed)
npm install

# Start development server
npm run dev
```

The frontend development server will be available at `http://localhost:5173` with hot reloading enabled.

### Backend Development

```bash
# Navigate to server directory
cd server

# Install dependencies (if not already installed)
npm install

# Start development server with hot reloading
npm run dev

# Build for production (includes config file copying)
npm run build

# Clean build artifacts
npm run clean
```

The backend development server will be available at `http://localhost:3000` with automatic restarts on file changes.

### Full Stack Development

For full stack development, you can run both frontend and backend simultaneously:

```bash
# Terminal 1: Frontend
cd frontend && npm run dev

# Terminal 2: Backend
cd server && npm run dev
```

## Adding New API Handlers

The application uses a modular API handler architecture. To add new endpoints:

1. Create a new folder and `index.ts` file in `server/api/handlers/`
2. Export route, method, and handler function using TypeScript
3. The route will be automatically loaded and registered

### Example: Adding a Products Handler

```typescript
// server/api/handlers/products/index.ts
import { Request, Response } from 'express';

export default {
  route: '/products',
  method: 'GET',
  handler: (req: Request, res: Response) => {
    res.json({ 
      success: true, 
      data: [
        { id: 1, name: 'Product 1', price: 100 },
        { id: 2, name: 'Product 2', price: 200 }
      ]
    });
  }
};
```

### Multiple HTTP Methods

You can export multiple handlers for different HTTP methods:

```typescript
// server/api/handlers/products/index.ts
import { Request, Response } from 'express';

// GET /api/products
export const getProducts = {
  route: '/products',
  method: 'GET',
  handler: (req: Request, res: Response) => {
    res.json({ success: true, data: [] });
  }
};

// POST /api/products
export const createProduct = {
  route: '/products',
  method: 'POST',
  handler: (req: Request, res: Response) => {
    const { name, price } = req.body;
    // Add product logic here
    res.json({ success: true, data: { id: Date.now(), name, price } });
  }
};

export default [getProducts, createProduct];
```

## Configuration Management

The application uses a layered configuration system with support for local development secrets:

### Configuration Files

- **`server/src/config/server.config.json`** - Base configuration (committed to source control)
- **`server/src/config/server.config.dev.json`** - Local development overrides with secrets (excluded from git)
- **`server/src/config/server.config.dev.json.template`** - Template for creating local dev config
- **`server/src/config/config-manager.ts`** - Configuration utility with type safety and deep merging

### First-Time Development Setup

1. **Copy the development config template**:
   ```bash
   cd server/src/config
   cp server.config.dev.json.template server.config.dev.json
   ```

2. **Edit with your actual secrets**:
   ```bash
   # Edit the dev config with real values
   nano server.config.dev.json
   ```

   Example `server.config.dev.json`:
   ```json
   {
     "session": {
       "secret": "your-development-session-secret-here"
     },
     "auth": {
       "oidc": {
         "clientSecret": "your-actual-oidc-client-secret"
       }
     }
   }
   ```

3. **The dev config is automatically excluded from git** - you can safely add secrets without worrying about committing them.

### Configuration Loading Priority

Configuration values are loaded and merged in this order:
1. **Base Configuration** - `server.config.json`
2. **Development Overrides** - `server.config.dev.json` (if exists)  
3. **Environment Variables** - System environment variables (highest priority)

### Usage in Development

```typescript
import configManager from './config/config-manager';

// Get complete configuration
const config = configManager.getConfiguration();

// Get specific sections
const serverConfig = configManager.getServerConfig();
const authConfig = configManager.getAuthConfig();
```

### Environment Variables (Still Supported)

Environment variables continue to work and will override both base config and dev config:

```bash
# Server configuration
PORT=3000
NODE_ENV=development

# Frontend configuration
FRONTEND_DIST=../../frontend/dist

# CORS configuration
CORS_ORIGIN=http://localhost:5173

# Authentication
DISABLE_AUTH=true

# Session secret (overrides both config files)
SESSION_SECRET=your-env-session-secret

# OIDC credentials (overrides dev config)
OIDC_CLIENT_SECRET=your-env-oidc-secret
```

### Development Environment Options

You now have multiple ways to configure your development environment:

**Option 1: Dev Config Only (Recommended)**
```bash
# Copy template and edit with secrets
cp server.config.dev.json.template server.config.dev.json
# Edit server.config.dev.json with your values
```

**Option 2: Environment Variables Only (Legacy)**
```bash
# Create .env file in server directory
echo "SESSION_SECRET=your-secret" > server/.env
echo "OIDC_CLIENT_SECRET=your-secret" >> server/.env
```

**Option 3: Mixed Approach**
```bash
# Use dev config for most secrets, env vars for specific overrides
# Dev config: session secret, OIDC secrets
# Env vars: PORT, NODE_ENV, etc.
export PORT=4000
npm run dev
```

### Custom Configuration

You can customize various settings through the configuration system:

```bash
# Override specific configuration values
export PORT=4000
export CORS_ORIGIN=http://localhost:3000
./scripts/build-frontend.sh
```

For detailed information about the configuration system, see the [Configuration Guide](Configuration.md).

## Debugging

### VS Code Debugging

The devcontainer includes debugging configurations for both frontend and backend:

1. **Frontend**: Use the built-in Vite debugging tools
2. **Backend**: Use VS Code's Node.js debugger with the provided launch configurations

### Backend Debugging

```bash
# Start server in debug mode
cd server && npm run debug
```

Then attach the VS Code debugger or use the provided debug configuration.

## Code Style and Linting

The project includes ESLint and TypeScript configurations:

### Frontend Linting

```bash
cd frontend
npm run lint
npm run lint:fix  # Auto-fix issues
```

### Backend Linting

```bash
cd server
npm run lint
npm run lint:fix  # Auto-fix issues
```

## File Structure

```
├── frontend/           # React application
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── features/   # Feature-specific components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── lib/        # Utility functions
│   │   └── providers/  # Context providers
│   ├── public/         # Static assets
│   └── package.json
├── server/            # Express server
│   ├── src/
│   │   ├── api/        # API routes and handlers
│   │   ├── config/     # Configuration management
│   │   │   ├── config-manager.ts     # Configuration utility
│   │   │   ├── server.config.json    # Default configuration
│   │   │   └── index.ts              # Barrel export
│   │   └── types/      # TypeScript type definitions
│   └── package.json
├── scripts/           # Build and utility scripts
└── docs/             # Documentation
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Change the PORT in configuration file or environment variable if 3000 is in use
2. **Node version**: Ensure you're using the Node.js version specified in `.devcontainer`
3. **Dependencies**: Run `npm install` in both `frontend/` and `server/` directories
4. **TypeScript errors**: Check `tsconfig.json` files for proper configuration

### Devcontainer Issues

If the devcontainer fails to start:
1. Ensure Docker is running
2. Rebuild the devcontainer: `Ctrl+Shift+P` → "Dev Containers: Rebuild Container"
3. Check Docker logs for error messages

### API Handler Issues

If new API handlers aren't being loaded:
1. Check the file structure matches the expected pattern
2. Ensure the handler exports the correct format
3. Restart the server after adding new handlers
4. Check server logs for loading errors
