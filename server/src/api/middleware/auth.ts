import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as OpenIDConnectStrategy } from "passport-openidconnect";

// Check if authentication is disabled
const isAuthDisabled = () => {
  return process.env.DISABLE_AUTH === "true" || process.env.DISABLE_AUTH === "1";
};

/**
 * Configure session middleware
 */
export const configureSession = () => {
  return session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  });
};

/**
 * Configure Passport.js with OpenID Connect strategy
 */
export const configurePassport = () => {
  // OpenID Connect Strategy
  passport.use(
    "oidc",
    new OpenIDConnectStrategy(
      {
        issuer: process.env.OIDC_ISSUER || "",
        authorizationURL: process.env.OIDC_AUTHORIZATION_URL || "",
        tokenURL: process.env.OIDC_TOKEN_URL || "",
        userInfoURL: process.env.OIDC_USERINFO_URL || "",
        clientID: process.env.OIDC_CLIENT_ID || "",
        clientSecret: process.env.OIDC_CLIENT_SECRET || "",
        callbackURL: process.env.OIDC_CALLBACK_URL || "/auth/callback",
        scope: "openid profile email",
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
