# Multi-stage Docker build for React + Express application

# Stage 1: Build Frontend
FROM node:22-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./
RUN npm ci --only=production

# Copy frontend source code
COPY frontend/ ./

# Build the frontend
RUN npm install && npm run build

# Stage 2: Build Backend
FROM node:22-alpine AS backend-builder

WORKDIR /app/server

# Copy server package files
COPY server/package*.json ./
COPY server/tsconfig.json ./
RUN npm ci

# Copy server source code
COPY server/src ./src

# Build the backend
RUN npm install && npm run build

# Stage 3: Production Runtime
FROM node:22-alpine AS production

WORKDIR /app

# Install production dependencies for server
COPY server/package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built backend from builder stage
COPY --from=backend-builder /app/server/dist ./

# Copy built frontend from builder stage
COPY --from=frontend-builder /app/frontend/dist ./frontend-dist

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

# Environment variables
ENV NODE_ENV=production
ENV PORT=8324
ENV FRONTEND_DIST=frontend-dist

# Expose the port
EXPOSE 8324

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); \
               const options = { hostname: 'localhost', port: process.env.PORT || 8324, path: '/api/health', timeout: 2000 }; \
               const req = http.request(options, (res) => { \
                 process.exit(res.statusCode === 200 ? 0 : 1); \
               }); \
               req.on('error', () => process.exit(1)); \
               req.end();"

# Start the application
CMD ["node", "index.js"]
