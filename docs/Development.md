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
```

The backend development server will be available at `http://localhost:8324` with automatic restarts on file changes.

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

## Environment Variables

### Development Environment

Create a `.env` file in the root directory for local development:

```bash
# Server configuration
PORT=8324
NODE_ENV=development

# Frontend configuration
FRONTEND_DIST=dist/frontend

# CORS configuration
CORS_ORIGIN=http://localhost:5173
```

### Custom Environment Variables

You can customize the frontend distribution path:

```bash
export FRONTEND_DIST="custom/frontend/path"
./scripts/build-frontend.sh
```

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
│   │   └── types/      # TypeScript type definitions
│   └── package.json
├── scripts/           # Build and utility scripts
└── docs/             # Documentation
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Change the PORT environment variable if 8324 is in use
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
