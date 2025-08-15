import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as OpenIDConnectStrategy } from "passport-openidconnect";
import configManager from "../../config/config-manager";

// Check if authentication is disabled
const isAuthDisabled = () => {
  const authConfig = configManager.getAuthConfig();
  return authConfig.disabled;
};

/**
 * Configure session middleware
 */
export const configureSession = () => {
  const sessionConfig = configManager.getSessionConfig();

  return session({
    secret: sessionConfig.secret,
    resave: sessionConfig.resave,
    saveUninitialized: sessionConfig.saveUninitialized,
    cookie: { secure: sessionConfig.cookieSecure },
  });
};

/**
 * Configure Passport.js with OpenID Connect strategy
 */
export const configurePassport = () => {
  const authConfig = configManager.getAuthConfig();

  // OpenID Connect Strategy
  passport.use(
    "oidc",
    new OpenIDConnectStrategy(
      {
        issuer: authConfig.oidc.issuer,
        authorizationURL: authConfig.oidc.authorizationURL,
        tokenURL: authConfig.oidc.tokenURL,
        userInfoURL: authConfig.oidc.userInfoURL,
        clientID: authConfig.oidc.clientID,
        clientSecret: authConfig.oidc.clientSecret,
        callbackURL: authConfig.oidc.callbackURL,
        scope: authConfig.oidc.scope,
      },
      (issuer: any, profile: any, done: any) => {
        return done(null, profile);
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user as any));
};

/**
 * Authentication middleware for protected routes
 */
export const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Skip authentication if disabled
  if (isAuthDisabled()) {
    console.log("⚠️  Authentication is DISABLED - allowing unrestricted access");
    return next();
  }

  if (req.isAuthenticated()) {
    return next();
  }

  // For API requests, return 401
  if (req.path.startsWith("/api/")) {
    return res.status(401).json({ error: "Authentication required" });
  }

  // For other requests, redirect to login
  res.redirect("/auth/login");
};

/**
 * Authentication routes
 */
export const createAuthRoutes = (app: express.Application) => {
  // If auth is disabled, create minimal mock routes
  if (isAuthDisabled()) {
    app.get("/auth/login", (req, res) => {
      res.json({ message: "Authentication disabled - no login required" });
    });

    app.get("/auth/callback", (req, res) => {
      res.redirect("/");
    });

    app.get("/auth/logout", (req, res) => {
      res.json({ message: "Authentication disabled - no logout required" });
    });

    app.get("/auth/user", (req, res) => {
      res.json({
        user: { id: "dev-user", name: "Development User", email: "dev@example.com" },
        authenticated: true,
        message: "Authentication disabled - mock user data",
      });
    });

    return;
  }

  // Normal auth routes when authentication is enabled
  app.get("/auth/login", passport.authenticate("oidc"));

  app.get(
    "/auth/callback",
    passport.authenticate("oidc", {
      successRedirect: "/",
      failureRedirect: "/auth/login",
    })
  );

  app.get("/auth/logout", (req, res) => {
    req.logout(() => {
      res.redirect("/");
    });
  });

  // Optional: User info endpoint for frontend
  app.get("/auth/user", requireAuth, (req, res) => {
    res.json({
      user: req.user,
      authenticated: req.isAuthenticated(),
    });
  });
};

/**
 * Initialize all authentication middleware
 */
export const initializeAuth = (app: express.Application) => {
  if (isAuthDisabled()) {
    console.log("🚨 WARNING: Authentication is DISABLED");
    console.log("   This should only be used in development environments");
    console.log("   Set DISABLE_AUTH=false or remove the environment variable to enable authentication");

    // Still setup basic session for consistency, but skip passport
    app.use(configureSession());

    // Setup mock auth routes
    createAuthRoutes(app);
    return;
  }

  console.log("🔐 Authentication is ENABLED");

  // Configure session
  app.use(configureSession());

  // Configure passport
  configurePassport();
  app.use(passport.initialize());
  app.use(passport.session());

  // Setup auth routes
  createAuthRoutes(app);
};
