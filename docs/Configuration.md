# Configuration Management

This document describes the configuration management system that uses structured JSON files with support for local development overrides and environment variable integration.

## Overview

The API loads its configuration from multiple sources in order of priority:
1. **Base Configuration** - `server.config.json` (committed to source control)
2. **Development Overrides** - `server.config.dev.json` (excluded from source control)
3. **Environment Variables** - System environment variables (highest priority)

This layered approach provides security, flexibility, and maintainability while keeping secrets out of source control.

## Configuration Files

### `server/src/config/server.config.json` (Base Configuration)
The main configuration file containing default application settings. Sensitive values are removed and should be provided via dev config or environment variables:

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
    "secret": "your-random-256-bit-session-secret-change-this-in-production-replace-with-dev-config",
    "resave": false,
    "saveUninitialized": false,
    "cookieSecure": false
  },
  "auth": {
    "disabled": false,
    "oidc": {
      "issuer": "https://login.microsoftonline.com/ae5a8cb0-673c-43ba-826c-c2d6c87f2d70/v2.0",
      "authorizationURL": "https://login.microsoftonline.com/ae5a8cb0-673c-43ba-826c-c2d6c87f2d70/oauth2/v2.0/authorize",
      "tokenURL": "https://login.microsoftonline.com/ae5a8cb0-673c-43ba-826c-c2d6c87f2d70/oauth2/v2.0/token",
      "userInfoURL": "https://graph.microsoft.com/oidc/userinfo",
      "clientID": "fbc70098-07fd-4e49-beda-4ca941cedb87",
      "clientSecret": "",
      "callbackURL": "http://localhost:3000/auth/callback",
      "scope": "openid profile email"
    }
  }
}
```

### `server/src/config/server.config.dev.json` (Development Overrides)
Local development configuration that overrides base values. **This file is excluded from source control** and contains sensitive data:

```json
{
  "session": {
    "secret": "development-session-secret-for-local-testing-only"
  },
  "auth": {
    "oidc": {
      "clientSecret": "your-actual-oidc-client-secret-here"
    }
  }
}
```

### `server/src/config/server.config.dev.json.template` (Developer Template)
Template file for creating local dev configuration. Developers copy this to get started:

```bash
cp server.config.dev.json.template server.config.dev.json
```

### `server/src/config/config-manager.ts`
The configuration management utility that:
- Loads and merges configurations in priority order
- Provides deep merge functionality for nested objects
- Allows environment variable overrides
- Provides type safety with TypeScript interfaces
- Implements singleton pattern for efficient access
- Includes validation and comprehensive logging

## Setup for Developers

### First-Time Setup

1. **Copy the template file**:
   ```bash
   cd server/src/config
   cp server.config.dev.json.template server.config.dev.json
   ```

2. **Edit with your actual secrets**:
   ```bash
   # Edit the dev config with real values
   nano server.config.dev.json
   ```

3. **The dev config is automatically excluded from git commits** - you can safely add secrets without worrying about committing them.

### Configuration Loading Priority

The system loads configuration in this order (later sources override earlier ones):

1. **📄 Base Configuration** - `server.config.json`
2. **🔧 Development Overrides** - `server.config.dev.json` (if exists)
3. **🌍 Environment Variables** - System environment variables

**Example loading log**:
```
📝 Development configuration loaded and merged from server.config.dev.json
✅ Configuration loaded successfully from server.config.json with dev overrides
🔧 Configuration overrides from: server.config.dev.json, Environment variables (PORT, SESSION_SECRET)
```

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

### Logging and Debugging

The system provides comprehensive logging to show exactly where configuration values come from:

```
📝 Development configuration loaded and merged from server.config.dev.json
✅ Configuration loaded successfully from server.config.json with dev overrides  
🔧 Configuration overrides from: server.config.dev.json, Environment variables (PORT, SESSION_SECRET)
🔐 Authentication is ENABLED
```

### Deep Merge Behavior

The dev config uses deep merging, so you only need to specify the values you want to override:

**Base config** (`server.config.json`):
```json
{
  "auth": {
    "disabled": false,
    "oidc": {
      "clientID": "abc123",
      "clientSecret": "",
      "scope": "openid profile email"
    }
  }
}
```

**Dev config** (`server.config.dev.json`):
```json
{
  "auth": {
    "oidc": {
      "clientSecret": "real-secret-here"
    }
  }
}
```

**Final merged result**:
```json
{
  "auth": {
    "disabled": false,
    "oidc": {
      "clientID": "abc123",
      "clientSecret": "real-secret-here",
      "scope": "openid profile email"
    }
  }
}
```

### Singleton Pattern
Configuration is loaded once and cached for efficient access throughout the application lifecycle.

## Security Best Practices

### ✅ Do's
- **Use dev config for secrets**: Store sensitive values in `server.config.dev.json`
- **Commit the template**: The `.template` file helps other developers get started
- **Use environment variables in production**: Override sensitive values with env vars in production
- **Keep base config clean**: No secrets in `server.config.json`

### ❌ Don'ts  
- **Don't commit dev config**: The `.gitignore` prevents this, but be aware
- **Don't put secrets in base config**: Keep `server.config.json` safe for source control
- **Don't rely on dev config in production**: Use environment variables instead

### Development vs Production

**Development** (local):
```
Base config → Dev config → Environment variables
```

**Production** (deployed):
```  
Base config → Environment variables
```

In production, you typically won't have a dev config file, so environment variables become the primary override mechanism.

## Migration from Environment Variables

The system is fully backward compatible - existing `.env` files and environment variables continue to work exactly as before. The main difference is that default values are now centralized in configuration files rather than scattered throughout the code.

### Migration Steps (Optional)

If you want to move from pure environment variables to the new system:

1. **Keep your existing environment variables** - they still work as overrides
2. **Copy sensitive values to dev config** - move secrets from `.env` to `server.config.dev.json`
3. **Update base config** - set appropriate defaults in `server.config.json`

## Build Process Integration

The build system automatically handles config files:

```bash
npm run build
```

This will:
- Copy `server.config.json` to `dist/config/`
- Copy `server.config.dev.json.template` to `dist/config/`
- Copy `server.config.dev.json` to `dist/config/` (if it exists)

## Best Practices

### Configuration Management
1. **Use dev config for secrets**: Store sensitive local development values in `server.config.dev.json`
2. **Environment-specific overrides**: Use environment variables for production deployments
3. **Template file maintenance**: Keep the template file updated when adding new secret configuration options
4. **Deep merge awareness**: Understand that dev config merges deeply, so you only need to specify changed values

### Security
1. **Never commit secrets**: The `.gitignore` protects you, but always verify what you're committing
2. **Production environment variables**: Always use environment variables for production secrets
3. **Validate on startup**: The built-in validation catches configuration errors early
4. **Rotate secrets regularly**: Easy to do with dev config - just update the file

### Development Workflow
1. **Copy template first**: Always start with the template file when setting up a new development environment
2. **Share template changes**: When adding new secret config options, update the template file too
3. **Documentation**: Document any new configuration options in this file

## Benefits

1. **🔒 Enhanced Security**: Secrets are kept out of source control while maintaining easy local development
2. **🎯 Centralized Configuration**: All settings organized in structured, type-safe files
3. **🔧 Flexible Overrides**: Three-layer priority system (base → dev → environment) 
4. **🛠️ Developer Experience**: Template files and clear setup process for new developers
5. **🔄 Backward Compatibility**: Existing environment variable workflows continue to work
6. **✅ Built-in Validation**: Configuration errors are caught at startup with clear error messages
7. **📝 Better Documentation**: Configuration structure is self-documenting with TypeScript interfaces
8. **🚀 Production Ready**: Easy deployment with environment variable overrides
