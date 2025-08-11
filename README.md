# Full Stack React + Express Application

A full stack TypeScript application with React frontend and Express.js backend, designed to serve both API requests and the frontend SPA from a single server.

## ✨ Features

- **TypeScript** throughout the entire stack
- **React SPA** frontend built with Vite
- **Express.js** backend with modular API handlers
- **VS Code devcontainer** for consistent development environment
- **Docker support** for easy deployment and distribution
- Single server serves both API and frontend
- Modular API handler architecture
- CORS middleware support

## Development Environment

This project is built with **TypeScript** throughout the stack and designed to run in **VS Code** using **devcontainer technology**. The devcontainer ensures a consistent development environment with all necessary tools and dependencies pre-configured.

### Prerequisites
- **VS Code** with the Dev Containers extension
- **Docker** (for devcontainer support and containerized deployment)

### Getting Started
1. Clone the repository
2. Open in VS Code
3. VS Code will prompt to "Reopen in Container" - click yes
4. The devcontainer will automatically set up the development environment

## Architecture

- **Frontend**: React SPA built with Vite and TypeScript
- **Backend**: Node.js Express server written in TypeScript
- **Development**: VS Code devcontainer with pre-configured tooling
- **Deployment**: Single server serves both API and frontend

## Project Structure

```
├── frontend/           # React application
├── server/            # Express server
│   ├── index.ts       # Main server file
│   ├── api/
│   │   ├── routes.ts  # Dynamic route loader
│   │   ├── middleware/
│   │   │   └── cors.ts # CORS configuration
│   │   └── handlers/  # API route handlers
│   └── package.json
├── scripts/           # Build scripts
│   ├── build-frontend.sh    # Build React app
│   ├── build-api.sh         # Build Express server
│   ├── docker-build-export.sh # Build and export Docker image
│   └── docker-test.sh       # Test Docker functionality
├── dist/             # Build output (created after build)
│   ├── frontend/     # Built React app
│   └── api/         # Built server
├── Dockerfile        # Docker multi-stage build configuration
├── docker-compose.yml # Docker Compose configuration
├── .dockerignore     # Docker ignore file
├── .env.example      # Environment variables example
└── build.sh         # Master build script
```

## Server Features

### 1. **Dual Purpose Server**
- Serves API requests at `/api/*`
- Serves frontend SPA for all other routes (`/`)
- Uses `FRONTEND_DIST` environment variable (default: `dist/frontend`)

### 2. **Modular API Handlers**
- Each API method is a separate module in `server/api/handlers/`
- Handlers export route, method, and handler function
- Routes are automatically loaded and registered

### 3. **CORS Middleware**
- Configured in `server/api/middleware/cors.ts`
- Supports environment-based configuration

## API Handler Example

```typescript
// server/api/handlers/users/index.ts
export default {
  route: '/users',
  method: 'GET',
  handler: (req: Request, res: Response) => {
    res.json({ success: true, data: [] });
  }
};
```

## Environment Variables

```bash
PORT=8324                    # Server port
FRONTEND_DIST=dist/frontend  # Frontend distribution path
CORS_ORIGIN=*               # CORS origin configuration
```

## Build & Run

### � Traditional Build
```bash
# Build everything
./build.sh

# Run the server
cd dist/api && npm start
```

### Individual Builds
```bash
# Build frontend only
./scripts/build-frontend.sh

# Build API only
./scripts/build-api.sh
```

### Development
```bash
# Frontend development
cd frontend && npm run dev

# Server development
cd server && npm run dev
```

## Testing

### Traditional Testing
```bash
# Test the built application
./build.sh
cd dist/api && npm start

# Verify the server is running
curl http://localhost:8324/api/health
```

###  Docker Build & Test

#### Quick Docker Start
```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build and run manually
docker build -t aab-react-express .
docker run -p 8324:8324 aab-react-express
```

#### Test Docker Functionality
```bash
# Build and export as tar file for distribution
./scripts/docker-build-export.sh

# Test Docker build and functionality
./scripts/docker-test.sh
```

This creates a `aab-react-express-latest.tar` file that can be shared and loaded on any Docker-enabled system.

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/users` - Get users
- `POST /api/users` - Create user
- `DELETE /api/users/:id` - Delete user

##  Docker Support

This application includes full **Docker support** for easy deployment and distribution. You can run the application in a containerized environment or export it as a portable Docker image.

##  Docker Commands Reference

### Building and Running
```bash
# Build Docker image
docker build -t aab-react-express .

# Run container
docker run -d -p 8324:8324 --name aab-app aab-react-express

# Run with custom port mapping
docker run -d -p 3000:8324 --name aab-app aab-react-express

# Run with environment variables
docker run -d -p 8324:8324 -e NODE_ENV=production --name aab-app aab-react-express
```

### Docker Compose
```bash
# Start application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop application
docker-compose down

# Rebuild and start
docker-compose up --build -d
```

### Container Management
```bash
# View running containers
docker ps

# View logs
docker logs aab-app

# Execute shell in container
docker exec -it aab-app sh

# Stop container
docker stop aab-app

# Start stopped container
docker start aab-app

# Remove container
docker rm aab-app

# Remove image
docker rmi aab-react-express
```

### Image Distribution
```bash
# Export image to tar file
./scripts/docker-build-export.sh

# Load image from tar file
docker load -i aab-react-express-latest.tar

# Push to registry (if configured)
docker tag aab-react-express your-registry/aab-react-express:latest
docker push your-registry/aab-react-express:latest
```

## Custom Environment Variables

Set `FRONTEND_DIST` to customize where the frontend is served from:

```bash
export FRONTEND_DIST="custom/frontend/path"
./scripts/build-frontend.sh
```

## Adding New API Handlers

1. Create a new folder and `index.ts` file in `server/api/handlers/`
2. Export route, method, and handler function using TypeScript
3. The route will be automatically loaded

Example:
```typescript
// server/api/handlers/products/index.ts
import { Request, Response } from 'express';

export default {
  route: '/products',
  method: 'GET',
  handler: (req: Request, res: Response) => {
    res.json({ products: [] });
  }
};
```

## Production Deployment

###  Docker Deployment (Recommended)
```bash
# Build and export the Docker image
./scripts/docker-build-export.sh

# Transfer the aab-react-express-latest.tar to your production server
scp aab-react-express-latest.tar user@production-server:/path/to/deployment/

# On production server, load and run
docker load -i aab-react-express-latest.tar
docker run -d -p 80:8324 --name aab-app --restart unless-stopped aab-react-express:latest
```

### 📦 Traditional Deployment
1. Build the application: `./build.sh`
2. Deploy the `dist/api` folder to your server
3. Set environment variables
4. Run: `npm start`

### Environment Variables for Docker
```bash
# Production environment variables
NODE_ENV=production      # Runtime environment
PORT=8324               # Server port
FRONTEND_DIST=frontend-dist  # Frontend files location (set automatically in Docker)
CORS_ORIGIN=*          # CORS origin configuration
```

The server will serve your React app and handle API requests on the same port.
