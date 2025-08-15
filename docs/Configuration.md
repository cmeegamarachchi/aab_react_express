# Configuration Management

This document describes the new configuration management system that replaces direct environment variable usage with a structured configuration approach.

## Overview

The API now loads its configuration from a `server.config.json` file located in `server/src/config/` through a utility module called `config-manager.ts`. This provides better organization, type safety, and maintainability.

## Configuration Files

### `server/src/config/server.config.json`
The main configuration file containing all application settings organized into logical sections:

```json
{
  "server": {
    "port": 3000,
    "frontendDist": "../../frontend/dist",
    "nodeEnv": "development"
  },
  "cors": {
    "origin": "http://localhost:5173",
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allowedHeaders": ["Content-Type", "Authorization"],
    "credentials": true
  },
  "session": {
    "secret": "your-random-256-bit-session-secret-change-this-in-production",
    "resave": false,
    "saveUninitialized": false,
    "cookieSecure": false
  },
  "auth": {
    "disabled": false,
    "oidc": {
      "issuer": "https://login.microsoftonline.com/...",
      "authorizationURL": "https://login.microsoftonline.com/...",
      "tokenURL": "https://login.microsoftonline.com/...",
      "userInfoURL": "https://graph.microsoft.com/oidc/userinfo",
      "clientID": "your-client-id",
      "clientSecret": "your-client-secret",
      "callbackURL": "http://localhost:3000/auth/callback",
      "scope": "openid profile email"
    }
  }
}
```

### `server/src/config/config-manager.ts`
The configuration management utility that:
- Loads configuration from the JSON file
- Allows environment variable overrides
- Provides type safety with TypeScript interfaces
- Implements singleton pattern for efficient access
- Includes validation and logging features

## Usage

### Basic Usage

```typescript
import configManager from './config/config-manager';

// Get complete configuration
const config = configManager.getConfiguration();

// Get specific sections
const serverConfig = configManager.getServerConfig();
const corsConfig = configManager.getCorsConfig();
const sessionConfig = configManager.getSessionConfig();
const authConfig = configManager.getAuthConfig();
```

### Environment Variable Overrides

Environment variables still work and will override corresponding configuration file values:

- `PORT` → `server.port`
- `FRONTEND_DIST` → `server.frontendDist`
- `NODE_ENV` → `server.nodeEnv`
- `CORS_ORIGIN` → `cors.origin`
- `SESSION_SECRET` → `session.secret`
- `DISABLE_AUTH` → `auth.disabled`
- `OIDC_ISSUER` → `auth.oidc.issuer`
- `OIDC_AUTHORIZATION_URL` → `auth.oidc.authorizationURL`
- `OIDC_TOKEN_URL` → `auth.oidc.tokenURL`
- `OIDC_USERINFO_URL` → `auth.oidc.userInfoURL`
- `OIDC_CLIENT_ID` → `auth.oidc.clientID`
- `OIDC_CLIENT_SECRET` → `auth.oidc.clientSecret`
- `OIDC_CALLBACK_URL` → `auth.oidc.callbackURL`

## Features

### Type Safety
The `ApplicationConfiguration` interface ensures type safety throughout the application:

```typescript
export interface ApplicationConfiguration {
  server: {
    port: number;
    frontendDist: string;
    nodeEnv: string;
  };
  cors: {
    origin: string;
    methods: string[];
    allowedHeaders: string[];
    credentials: boolean;
  };
  // ... other sections
}
```

### Validation
The configuration manager includes validation to ensure:
- Server port is valid
- Session secret meets minimum length requirements
- OIDC credentials are present when authentication is enabled

### Logging
The system provides helpful logging:
- ✅ Configuration loaded successfully
- 🔧 Environment variable overrides listing
- ❌ Validation errors and loading failures

### Singleton Pattern
Configuration is loaded once and cached for efficient access throughout the application lifecycle.

## Migration from Environment Variables

The migration is backward compatible - existing `.env` files continue to work as environment variable overrides. However, default values are now centralized in the configuration file rather than scattered throughout the code.

## Best Practices

1. **Sensitive Data**: Keep sensitive data like client secrets in environment variables rather than the config file
2. **Environment-Specific**: Use different config files or environment overrides for different deployment environments
3. **Version Control**: The base config file can be committed to version control, but ensure sensitive values are overridden via environment variables
4. **Validation**: Always validate configuration on startup to catch issues early

## Benefits

1. **Centralized Configuration**: All settings in one organized location
2. **Type Safety**: TypeScript interfaces prevent configuration errors
3. **Better Documentation**: Configuration structure is self-documenting
4. **Maintainability**: Easier to understand and modify application settings
5. **Backward Compatibility**: Existing environment variable workflows continue to work
6. **Validation**: Built-in validation prevents common configuration mistakes
