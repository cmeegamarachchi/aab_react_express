# Docker Guide

This guide covers Docker setup, commands, and deployment strategies for the Full Stack React + Express Application.

## Docker Overview

This application includes full **Docker support** for easy deployment and distribution. You can run the application in a containerized environment or export it as a portable Docker image.

## Quick Start

### Docker Compose (Recommended)

```bash
# Build and run with Docker Compose
docker-compose up --build

# Run in detached mode
docker-compose up -d --build
```

### Manual Docker Build

```bash
# Build Docker image
docker build -t aab-react-express .

# Run container
docker run -p 8324:8324 aab-react-express
```

## Docker Architecture

### Multi-stage Build

The `Dockerfile` uses a multi-stage build process:

1. **Build Stage**: Compiles both frontend and backend
2. **Production Stage**: Creates minimal runtime image

### Image Contents

The final Docker image contains:
- Node.js runtime
- Built application in `/app`
- Production dependencies only
- Optimized for minimal size

## Docker Commands Reference

### Building Images

```bash
# Build with default tag
docker build -t aab-react-express .

# Build with custom tag
docker build -t aab-react-express:v1.0.0 .

# Build with different target
docker build --target production -t aab-react-express:prod .
```

### Running Containers

```bash
# Basic run
docker run -p 8324:8324 aab-react-express

# Run in detached mode
docker run -d -p 8324:8324 --name aab-app aab-react-express

# Run with custom port mapping
docker run -d -p 3000:8324 --name aab-app aab-react-express

# Run with environment variables
docker run -d -p 8324:8324 \
  -e NODE_ENV=production \
  -e CORS_ORIGIN=https://mydomain.com \
  --name aab-app aab-react-express

# Run with volume mount (for logs)
docker run -d -p 8324:8324 \
  -v /host/logs:/app/logs \
  --name aab-app aab-react-express
```

### Container Management

```bash
# View running containers
docker ps

# View all containers
docker ps -a

# View container logs
docker logs aab-app

# Follow logs in real-time
docker logs -f aab-app

# Execute shell in running container
docker exec -it aab-app sh

# Stop container
docker stop aab-app

# Start stopped container
docker start aab-app

# Restart container
docker restart aab-app

# Remove container
docker rm aab-app

# Remove container and volumes
docker rm -v aab-app
```

### Image Management

```bash
# List images
docker images

# Remove image
docker rmi aab-react-express

# Remove unused images
docker image prune

# View image details
docker inspect aab-react-express
```

## Docker Compose

### Configuration

The `docker-compose.yml` file provides a complete setup:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8324:8324"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

### Docker Compose Commands

```bash
# Start services
docker-compose up

# Start in detached mode
docker-compose up -d

# Build and start
docker-compose up --build

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View logs
docker-compose logs

# Follow logs
docker-compose logs -f

# Scale services (if configured)
docker-compose up --scale app=3

# Execute command in service
docker-compose exec app sh
```

## Testing Docker Builds

### Automated Testing

```bash
# Build and export Docker image for testing
./scripts/docker-build-export.sh

# Test Docker functionality
./scripts/docker-test.sh
```

### Manual Testing

```bash
# Build image
docker build -t aab-react-express-test .

# Run container
docker run -d -p 8325:8324 --name test-app aab-react-express-test

# Test health endpoint
curl http://localhost:8325/api/health

# Test frontend
curl http://localhost:8325/

# Cleanup
docker stop test-app && docker rm test-app
```

## Image Distribution

### Export/Import

```bash
# Export image to tar file
docker save aab-react-express:latest -o aab-react-express-latest.tar

# Or use the script
./scripts/docker-build-export.sh

# Import image on another system
docker load -i aab-react-express-latest.tar
```

### Registry Push/Pull

```bash
# Tag for registry
docker tag aab-react-express:latest your-registry/aab-react-express:latest

# Push to registry
docker push your-registry/aab-react-express:latest

# Pull from registry
docker pull your-registry/aab-react-express:latest
```

## Production Deployment

### Single Server Deployment

```bash
# Build and export image
./scripts/docker-build-export.sh

# Transfer to production server
scp aab-react-express-latest.tar user@prod-server:/tmp/

# On production server
ssh user@prod-server
docker load -i /tmp/aab-react-express-latest.tar

# Run with production settings
docker run -d \
  -p 80:8324 \
  -e NODE_ENV=production \
  -e CORS_ORIGIN=https://yourdomain.com \
  --name aab-app \
  --restart unless-stopped \
  aab-react-express:latest
```

### Docker Swarm Deployment

```bash
# Initialize swarm (on manager node)
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml aab-stack

# List services
docker service ls

# View service logs
docker service logs aab-stack_app

# Scale service
docker service scale aab-stack_app=3

# Update service
docker service update --image aab-react-express:v2 aab-stack_app
```

### Kubernetes Deployment

Example Kubernetes manifests:

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aab-react-express
spec:
  replicas: 3
  selector:
    matchLabels:
      app: aab-react-express
  template:
    metadata:
      labels:
        app: aab-react-express
    spec:
      containers:
      - name: app
        image: aab-react-express:latest
        ports:
        - containerPort: 8324
        env:
        - name: NODE_ENV
          value: "production"
---
apiVersion: v1
kind: Service
metadata:
  name: aab-react-express-service
spec:
  selector:
    app: aab-react-express
  ports:
  - port: 80
    targetPort: 8324
  type: LoadBalancer
```

## Environment Variables

### Container Environment Variables

```bash
# Essential variables
NODE_ENV=production          # Runtime environment
PORT=8324                   # Server port (internal)
FRONTEND_DIST=frontend      # Frontend files location (set automatically)

# Optional variables
CORS_ORIGIN=*               # CORS origin configuration
LOG_LEVEL=info              # Logging level
TZ=UTC                      # Timezone
```

### Docker Compose Environment

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8324:8324"
    environment:
      - NODE_ENV=production
      - CORS_ORIGIN=https://yourdomain.com
      - LOG_LEVEL=info
    env_file:
      - .env.production
```

## Performance Optimization

### Image Size Optimization

The Dockerfile includes several optimizations:
- Multi-stage builds to reduce final image size
- `.dockerignore` to exclude unnecessary files
- Production-only dependencies in final stage
- Alpine Linux base image for minimal footprint

### Runtime Optimization

```bash
# Run with memory limits
docker run -d \
  -p 8324:8324 \
  --memory=512m \
  --cpus=1.0 \
  --name aab-app \
  aab-react-express

# Run with restart policies
docker run -d \
  -p 8324:8324 \
  --restart unless-stopped \
  --name aab-app \
  aab-react-express
```

## Monitoring and Logging

### Container Logs

```bash
# View recent logs
docker logs --tail 50 aab-app

# Follow logs with timestamps
docker logs -f -t aab-app

# View logs for specific time period
docker logs --since="2024-01-01T00:00:00" --until="2024-01-02T00:00:00" aab-app
```

### Health Checks

Add health checks to your Dockerfile:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8324/api/health || exit 1
```

### Monitoring with Docker Stats

```bash
# View resource usage
docker stats aab-app

# View all containers
docker stats

# Export stats to file
docker stats --no-stream > container-stats.txt
```

## Troubleshooting

### Common Issues

1. **Container won't start**:
   ```bash
   # Check container logs
   docker logs aab-app
   
   # Check if port is available
   netstat -ln | grep 8324
   ```

2. **Build failures**:
   ```bash
   # Clean build cache
   docker builder prune
   
   # Build with no cache
   docker build --no-cache -t aab-react-express .
   ```

3. **Network issues**:
   ```bash
   # Check container network
   docker network ls
   docker inspect aab-app
   ```

### Debugging

```bash
# Run container with shell for debugging
docker run -it --entrypoint sh aab-react-express

# Execute debugging commands in running container
docker exec -it aab-app sh
```

## Security Considerations

### Container Security

```bash
# Run as non-root user (add to Dockerfile)
USER node

# Run with read-only root filesystem
docker run -d --read-only -p 8324:8324 aab-react-express

# Limit capabilities
docker run -d --cap-drop ALL --cap-add CHOWN aab-react-express
```

### Image Scanning

```bash
# Scan image for vulnerabilities
docker scout cves aab-react-express

# Or use external tools
trivy image aab-react-express
```
