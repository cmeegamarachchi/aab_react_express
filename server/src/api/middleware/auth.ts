import express from "express";
import session from "express-session";
import passport from "passport";
import { Issuer, Strategy, Client } from "openid-client";
import configManager from "../../config/config-manager";

// Global type declarations for OIDC client and issuer
declare global {
  var oidcClient: Client | undefined;
  var oidcIssuer: Issuer | undefined;
}

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
 * Configure Passport.js with OpenID Client strategy
 */
export const configurePassport = async () => {
  const authConfig = configManager.getAuthConfig();

  try {
    // Discover the OpenID issuer configuration
    const issuer = await Issuer.discover(authConfig.oidc.issuer);
    console.log("🔍 Discovered issuer", issuer.issuer, issuer.metadata);

    // Create a client
    const client = new issuer.Client({
      client_id: authConfig.oidc.clientID,
      client_secret: authConfig.oidc.clientSecret,
      redirect_uris: [authConfig.oidc.callbackURL],
      response_types: ["code"],
    });

    // Store client and issuer for logout functionality
    global.oidcClient = client;
    global.oidcIssuer = issuer;

    // Configure the Strategy
    passport.use(
      "oidc",
      new Strategy(
        {
          client,
          params: {
            scope: authConfig.oidc.scope,
          },
        },
        (tokenSet: any, userinfo: any, done: any) => {
          console.log("🎫 Token set:", tokenSet.claims());
          console.log("👤 User info:", userinfo);

          // Create user object from userinfo
          const user = {
            id: userinfo.sub,
            email: userinfo.email,
            name: userinfo.name,
            picture: userinfo.picture,
            profile: userinfo,
          };

          return done(null, user);
        }
      )
    );

    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((user, done) => done(null, user as any));

    console.log("✅ OpenID Client strategy configured successfully");
  } catch (error) {
    console.error("❌ Failed to configure OpenID Client strategy:", error);
    throw error;
  }
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
    const client = global.oidcClient;
    const issuer = global.oidcIssuer;

    // Destroy the local session first
    req.logout(() => {
      req.session.destroy((err) => {
        if (err) {
          console.error("Session destruction error:", err);
        }

        // If we have OIDC client and issuer, perform proper logout
        if (client && issuer && issuer.metadata.end_session_endpoint) {
          try {
            // Construct the logout URL with the auth provider
            const logoutUrl = client.endSessionUrl({
              post_logout_redirect_uri: `${req.protocol}://${req.get("host")}/auth/logged-out`,
            });

            console.log("🚪 Redirecting to provider logout:", logoutUrl);
            return res.redirect(logoutUrl);
          } catch (error) {
            console.error("Error constructing logout URL:", error);
          }
        }

        // Fallback: redirect to login page
        console.log("🚪 Fallback logout - redirecting to login");
        res.redirect("/auth/login");
      });
    });
  });

  // New endpoint for post-logout redirect
  app.get("/auth/logged-out", (req, res) => {
    // Clear any remaining cookies
    res.clearCookie("connect.sid"); // Default express-session cookie name

    // Send a simple page that shows logout success and provides login link
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Logged Out</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: #f5f5f5;
              margin: 0;
              padding: 40px;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              text-align: center;
              max-width: 400px;
              width: 100%;
            }
            h1 { color: #333; margin-bottom: 20px; }
            p { color: #666; margin-bottom: 30px; }
            .login-btn {
              background: #0066cc;
              color: white;
              padding: 12px 24px;
              border: none;
              border-radius: 4px;
              text-decoration: none;
              display: inline-block;
              font-size: 16px;
              transition: background 0.2s;
            }
            .login-btn:hover { background: #0052a3; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>✅ Successfully Logged Out</h1>
            <p>You have been logged out from both the application and your identity provider.</p>
            <a href="/auth/login" class="login-btn">Sign In Again</a>
          </div>
        </body>
      </html>
    `);
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
export const initializeAuth = async (app: express.Application) => {
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

  // Configure passport (now async)
  await configurePassport();
  app.use(passport.initialize());
  app.use(passport.session());

  // Setup auth routes
  createAuthRoutes(app);
};
