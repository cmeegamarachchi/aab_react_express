import fs from "fs";
import path from "path";

/**
 * Application Configuration Interface
 */
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
  session: {
    secret: string;
    resave: boolean;
    saveUninitialized: boolean;
    cookieSecure: boolean;
  };
  auth: {
    disabled: boolean;
    oidc: {
      issuer: string;
      clientID: string;
      clientSecret: string;
      callbackURL: string;
      scope: string;
    };
  };
}

class ConfigManager {
  private static instance: ConfigManager;
  private configuration: ApplicationConfiguration | null = null;
  private readonly configPath: string;
  private readonly devConfigPath: string;

  private constructor() {
    this.configPath = path.join(__dirname, "server.config.json");
    this.devConfigPath = path.join(__dirname, "server.config.dev.json");
  }

  /**
   * Get singleton instance of ConfigManager
   */
  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  /**
   * Deep merge two objects, with the second object overriding values in the first
   */
  private deepMerge(target: any, source: any): any {
    if (source === null || source === undefined) {
      return target;
    }

    if (typeof source !== "object" || Array.isArray(source)) {
      return source;
    }

    const result = { ...target };

    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (
          typeof source[key] === "object" &&
          !Array.isArray(source[key]) &&
          source[key] !== null &&
          typeof target[key] === "object" &&
          !Array.isArray(target[key]) &&
          target[key] !== null
        ) {
          result[key] = this.deepMerge(target[key], source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }

    return result;
  }

  /**
   * Load configuration from server.config.json file
   * Optionally merge with server.config.dev.json for local overrides
   * Environment variables can override configuration values
   */
  public loadConfiguration(): ApplicationConfiguration {
    if (this.configuration) {
      return this.configuration;
    }

    try {
      // Read base configuration file
      const configData = fs.readFileSync(this.configPath, "utf8");
      let baseConfig: ApplicationConfiguration = JSON.parse(configData);

      // Check if dev config file exists and merge it
      let devConfigLoaded = false;
      if (fs.existsSync(this.devConfigPath)) {
        try {
          const devConfigData = fs.readFileSync(this.devConfigPath, "utf8");
          const devConfig = JSON.parse(devConfigData);
          baseConfig = this.deepMerge(baseConfig, devConfig);
          devConfigLoaded = true;
          console.log("📝 Development configuration loaded and merged from server.config.dev.json");
        } catch (devError) {
          console.warn("⚠️ Warning: server.config.dev.json exists but could not be parsed:", devError);
        }
      }

      // Override with environment variables if they exist
      this.configuration = {
        server: {
          port: process.env.PORT ? parseInt(process.env.PORT, 10) : baseConfig.server.port,
          frontendDist: process.env.FRONTEND_DIST || baseConfig.server.frontendDist,
          nodeEnv: process.env.NODE_ENV || baseConfig.server.nodeEnv,
        },
        cors: {
          origin: process.env.CORS_ORIGIN || baseConfig.cors.origin,
          methods: baseConfig.cors.methods,
          allowedHeaders: baseConfig.cors.allowedHeaders,
          credentials: baseConfig.cors.credentials,
        },
        session: {
          secret: process.env.SESSION_SECRET || baseConfig.session.secret,
          resave: baseConfig.session.resave,
          saveUninitialized: baseConfig.session.saveUninitialized,
          cookieSecure: process.env.NODE_ENV === "production" || baseConfig.session.cookieSecure,
        },
        auth: {
          disabled: process.env.DISABLE_AUTH === "true" || process.env.DISABLE_AUTH === "1" || baseConfig.auth.disabled,
          oidc: {
            issuer: process.env.OIDC_ISSUER || baseConfig.auth.oidc.issuer,
            clientID: process.env.OIDC_CLIENT_ID || baseConfig.auth.oidc.clientID,
            clientSecret: process.env.OIDC_CLIENT_SECRET || baseConfig.auth.oidc.clientSecret,
            callbackURL: process.env.OIDC_CALLBACK_URL || baseConfig.auth.oidc.callbackURL,
            scope: baseConfig.auth.oidc.scope,
          },
        },
      };

      console.log(
        "✅ Configuration loaded successfully from server.config.json" + (devConfigLoaded ? " with dev overrides" : "")
      );

      // Log configuration sources
      this.logConfigurationSources(devConfigLoaded);

      return this.configuration;
    } catch (error) {
      console.error("❌ Failed to load configuration from server.config.json:", error);
      throw new Error(`Configuration loading failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Get current configuration (loads if not already loaded)
   */
  public getConfiguration(): ApplicationConfiguration {
    if (!this.configuration) {
      return this.loadConfiguration();
    }
    return this.configuration;
  }

  /**
   * Reload configuration from file
   */
  public reloadConfiguration(): ApplicationConfiguration {
    this.configuration = null;
    return this.loadConfiguration();
  }

  /**
   * Get a specific configuration section
   */
  public getServerConfig() {
    return this.getConfiguration().server;
  }

  public getCorsConfig() {
    return this.getConfiguration().cors;
  }

  public getSessionConfig() {
    return this.getConfiguration().session;
  }

  public getAuthConfig() {
    return this.getConfiguration().auth;
  }

  /**
   * Log which configuration values are coming from environment variables vs config file
   */
  private logConfigurationSources(devConfigLoaded: boolean = false): void {
    const envOverrides: string[] = [];

    if (process.env.PORT) envOverrides.push("PORT");
    if (process.env.FRONTEND_DIST) envOverrides.push("FRONTEND_DIST");
    if (process.env.NODE_ENV) envOverrides.push("NODE_ENV");
    if (process.env.CORS_ORIGIN) envOverrides.push("CORS_ORIGIN");
    if (process.env.SESSION_SECRET) envOverrides.push("SESSION_SECRET");
    if (process.env.DISABLE_AUTH) envOverrides.push("DISABLE_AUTH");
    if (process.env.OIDC_ISSUER) envOverrides.push("OIDC_ISSUER");
    if (process.env.OIDC_CLIENT_ID) envOverrides.push("OIDC_CLIENT_ID");
    if (process.env.OIDC_CLIENT_SECRET) envOverrides.push("OIDC_CLIENT_SECRET");
    if (process.env.OIDC_CALLBACK_URL) envOverrides.push("OIDC_CALLBACK_URL");

    const sources: string[] = [];
    if (devConfigLoaded) sources.push("server.config.dev.json");
    if (envOverrides.length > 0) sources.push(`Environment variables (${envOverrides.join(", ")})`);

    if (sources.length > 0) {
      console.log("🔧 Configuration overrides from:", sources.join(", "));
    }
  }

  /**
   * Validate configuration
   */
  public validateConfiguration(): boolean {
    const config = this.getConfiguration();

    // Check required fields
    if (!config.server.port || config.server.port <= 0) {
      console.error("❌ Invalid server port configuration");
      return false;
    }

    if (!config.session.secret || config.session.secret.length < 16) {
      console.error("❌ Session secret is too short or missing");
      return false;
    }

    if (!config.auth.disabled) {
      if (!config.auth.oidc.clientID || !config.auth.oidc.clientSecret) {
        console.error("❌ OIDC client credentials are missing");
        return false;
      }
    }

    return true;
  }
}

// Export singleton instance and type
export const configManager = ConfigManager.getInstance();
export default configManager;
