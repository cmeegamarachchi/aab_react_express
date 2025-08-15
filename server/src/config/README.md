# Server Configuration

This folder contains the configuration management system for the server application.

## Files

- **`config-manager.ts`** - Main configuration management utility with singleton pattern, validation, and environment variable override support
- **`server.config.json`** - Default configuration values organized by functional areas (committed to source control)
- **`server.config.dev.json`** - Local development overrides with secrets (excluded from source control)
- **`server.config.dev.json.template`** - Template for creating your local dev config
- **`index.ts`** - Barrel export for easy importing

## Configuration Loading Priority

Configuration values are loaded and merged in the following order (later sources override earlier ones):

1. **Base Configuration** - `server.config.json`
2. **Development Overrides** - `server.config.dev.json` (if exists)
3. **Environment Variables** - System environment variables

## Development Setup

For local development with secrets:

1. Copy the template file:
   ```bash
   cp server.config.dev.json.template server.config.dev.json
   ```

2. Edit `server.config.dev.json` with your actual secrets:
   ```json
   {
     "session": {
       "secret": "your-actual-development-session-secret"
     },
     "auth": {
       "oidc": {
         "clientSecret": "your-actual-oidc-client-secret"
       }
     }
   }
   ```

3. The `server.config.dev.json` file is automatically excluded from git commits.

## Quick Start

```typescript
import { configManager } from './config';

const config = configManager.getConfiguration();
const port = config.server.port;
```

See [Configuration.md](../../docs/Configuration.md) for detailed documentation.
