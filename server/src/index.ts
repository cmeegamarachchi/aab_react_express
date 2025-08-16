import express from "express";
import path from "path";
import dotenv from "dotenv";
import configManager from "./config/config-manager";
import { initializeAuth, requireAuth } from "./api/middleware/auth";
import corsMiddleware from "./api/middleware/cors";
import apiRoutes from "./api/routes";

// Load environment variables first (for any overrides)
dotenv.config();

// Load and validate configuration
const config = configManager.loadConfiguration();
if (!configManager.validateConfiguration()) {
  console.error("❌ Configuration validation failed. Exiting...");
  process.exit(1);
}

const app = express();
const PORT: number = config.server.port;
const FRONTEND_DIST: string = config.server.frontendDist;

// Main application setup function
async function setupApp() {
  // Apply CORS middleware
  app.use(corsMiddleware);

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Initialize authentication (includes session, passport, and auth routes)
  await initializeAuth(app);

  // Protect API routes
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
}

// Start the application
setupApp().catch((error) => {
  console.error("❌ Failed to start server:", error);
  process.exit(1);
});
