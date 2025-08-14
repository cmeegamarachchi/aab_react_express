import express from "express";
import path from "path";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import { Strategy as OpenIDConnectStrategy } from "passport-openidconnect";

dotenv.config();

const app = express();
const PORT: number = parseInt(process.env.PORT || "8324", 10);
const FRONTEND_DIST: string = process.env.FRONTEND_DIST || "../frontend";

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

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

// Import CORS middleware
import corsMiddleware from "./api/middleware/cors";

// Apply CORS middleware
app.use(corsMiddleware);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Authentication routes
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

// Authentication middleware for protected routes
const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/login");
};

// Protect API routes
import apiRoutes from "./api/routes";
app.use("/api", requireAuth, apiRoutes);

// Serve static files from frontend distribution folder
app.use(requireAuth, express.static(path.resolve(__dirname, FRONTEND_DIST)));

// Catch-all handler: send back frontend's index.html file for SPA routing
app.get("*", requireAuth, (req: express.Request, res: express.Response) => {
  res.sendFile(path.resolve(__dirname, FRONTEND_DIST, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend served from: ${path.resolve(__dirname, FRONTEND_DIST)}`);
});
