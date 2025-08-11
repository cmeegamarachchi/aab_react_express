# TypeScript Express Server

A full-stack Express.js server written in TypeScript with dynamic route loading and CORS support.

## Features

- TypeScript for type safety and better development experience
- Dynamic route loading from handlers directory
- CORS middleware configuration
- Environment variable support with dotenv
- Development server with hot reloading using nodemon
- Health check endpoint

## Project Structure

```
server/
├── src/                     # TypeScript source files
│   ├── index.ts            # Main server entry point
│   ├── types/              # Type definitions
│   │   └── index.ts        # Route handler types
│   └── api/                # API routes and handlers
│       ├── routes.ts       # Dynamic route loader
│       ├── middleware/     # Express middleware
│       │   └── cors.ts     # CORS configuration
│       └── handlers/       # Route handlers
│           ├── users/      # User-related endpoints
│           │   └── index.ts
│           └── products/   # Product-related endpoints
│               └── index.ts
├── dist/                   # Compiled JavaScript output
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── nodemon.json           # Nodemon configuration
└── .env.example           # Environment variables template
```

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Development Mode**
   ```bash
   npm run dev
   ```
   The server will start with hot reloading on http://localhost:3000

4. **Production Build**
   ```bash
   npm run build
   npm start
   ```

## Available Scripts

- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run clean` - Remove build artifacts

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user
- `DELETE /api/users/:id` - Delete a user

### Products
- `GET /api/products` - Get all products

## Adding New Routes

1. Create a new directory under `src/api/handlers/` (e.g., `orders/`)
2. Add an `index.ts` file with route handlers following the `RouteHandler` interface:

```typescript
import { Request, Response } from 'express';
import { RouteHandler } from '../../types';

const handlers: RouteHandler[] = [
  {
    route: '/orders',
    method: 'GET',
    handler: (req: Request, res: Response): void => {
      res.json({ success: true, data: [] });
    },
  },
];

export default handlers;
```

Routes are automatically loaded when the server starts.

## Environment Variables

- `PORT` - Server port (default: 3000)
- `FRONTEND_DIST` - Path to frontend build files (default: ../frontend/dist)
- `CORS_ORIGIN` - Allowed CORS origins (default: *)

## TypeScript Configuration

The project uses strict TypeScript settings for better code quality:
- Strict null checks
- No implicit any
- Strict function types
- Source maps for debugging
- Declaration files for library usage
