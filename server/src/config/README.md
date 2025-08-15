# Server Configuration

This folder contains the configuration management system for the server application.

## Files

- **`config-manager.ts`** - Main configuration management utility with singleton pattern, validation, and environment variable override support
- **`server.config.json`** - Default configuration values organized by functional areas
- **`index.ts`** - Barrel export for easy importing

## Quick Start

```typescript
import { configManager } from './config';

const config = configManager.getConfiguration();
const port = config.server.port;
```

See [Configuration.md](../../docs/Configuration.md) for detailed documentation.
