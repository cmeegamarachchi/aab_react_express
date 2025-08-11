# Full Stack React + Express Application

A full stack TypeScript application with React frontend and Express.js backend, designed to serve both API requests and the frontend SPA from a single server.

## Features

- **TypeScript** throughout the entire stack
- **React SPA** frontend built with Vite and modern tooling
- **Express.js** backend with modular API handlers
- **VS Code devcontainer** for consistent development environment
- **Docker support** for easy deployment and distribution
- Single server serves both API and frontend
- Modular API handler architecture with automatic route loading
- CORS middleware support
- Environment-based configuration

## Architecture

- **Frontend**: React SPA built with Vite and TypeScript
- **Backend**: Node.js Express server written in TypeScript
- **Development**: VS Code devcontainer with pre-configured tooling
- **Deployment**: Single server serves both API and frontend

### Server Architecture

The Express server features a dual-purpose design:
- Serves API requests at `/api/*` endpoints
- Serves the React SPA for all other routes
- Uses modular API handlers with automatic route loading
- Configurable CORS middleware support

### API Handler Structure

Each API method is organized as a separate module in `server/api/handlers/`. Handlers export route, method, and handler function, which are automatically loaded and registered.

Example handler:
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

## Project Structure

```
├── frontend/           # React application (Vite + TypeScript)
├── server/            # Express server (TypeScript)
│   ├── index.ts       # Main server file
│   ├── api/
│   │   ├── routes.ts  # Dynamic route loader
│   │   ├── middleware/
│   │   │   └── cors.ts # CORS configuration
│   │   └── handlers/  # API route handlers
│   └── package.json
├── scripts/           # Build and utility scripts
├── docs/             # Documentation
├── dist/             # Build output (created after build)
├── Dockerfile        # Docker configuration
├── docker-compose.yml # Docker Compose setup
└── build.sh          # Master build script
```

## Quick Start

1. Clone the repository and open in VS Code
2. Accept the prompt to "Reopen in Container"
3. The devcontainer will set up the development environment automatically

## Documentation

For detailed information, see the following guides:

- **[Development Guide](docs/Development.md)** - Development setup, prerequisites, workflow, and adding new API handlers
- **[Building Guide](docs/Building.md)** - Build processes, testing, deployment preparation, and troubleshooting
- **[Docker Guide](docs/Dockerization.md)** - Docker setup, commands, deployment strategies, and optimization

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/users` - Get users
- `POST /api/users` - Create user
- `DELETE /api/users/:id` - Delete user

## Environment Variables

```bash
PORT=8324                    # Server port
FRONTEND_DIST=dist/frontend  # Frontend distribution path
CORS_ORIGIN=*               # CORS origin configuration
```
