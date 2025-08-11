# Full Stack React + Express Application

A full stack application with React frontend and Express.js backend, designed to serve both API requests and the frontend SPA from a single server.

## Architecture

- **Frontend**: React SPA built with Vite
- **Backend**: Node.js Express server
- **Deployment**: Single server serves both API and frontend

## Project Structure

```
├── frontend/           # React application
├── server/            # Express server
│   ├── index.js       # Main server file
│   ├── api/
│   │   ├── routes.js  # Dynamic route loader
│   │   ├── middleware/
│   │   │   └── cors.js # CORS configuration
│   │   └── handlers/  # API route handlers
│   └── package.json
├── scripts/           # Build scripts
├── dist/             # Build output (created after build)
│   ├── frontend/     # Built React app
│   └── api/         # Built server
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
- Configured in `server/api/middleware/cors.js`
- Supports environment-based configuration

## API Handler Example

```javascript
// server/api/handlers/users.js
module.exports = {
  route: '/users',
  method: 'GET',
  handler: (req, res) => {
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

### Quick Start
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

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/users` - Get users
- `POST /api/users` - Create user
- `DELETE /api/users/:id` - Delete user

## Custom Environment Variables

Set `FRONTEND_DIST` to customize where the frontend is served from:

```bash
export FRONTEND_DIST="custom/frontend/path"
./scripts/build-frontend.sh
```

## Adding New API Handlers

1. Create a new file in `server/api/handlers/`
2. Export route, method, and handler function
3. The route will be automatically loaded

Example:
```javascript
// server/api/handlers/products.js
module.exports = {
  route: '/products',
  method: 'GET',
  handler: (req, res) => {
    res.json({ products: [] });
  }
};
```

## Production Deployment

1. Build the application: `./build.sh`
2. Deploy the `dist/api` folder to your server
3. Set environment variables
4. Run: `npm start`

The server will serve your React app and handle API requests on the same port.
