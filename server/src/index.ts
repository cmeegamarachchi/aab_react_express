import express from "express";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT: number = parseInt(process.env.PORT || "8324", 10);
const FRONTEND_DIST: string = process.env.FRONTEND_DIST || "../frontend";

// Initialize authentication
import { initializeAuth, requireAuth } from "./api/middleware/auth";

// Initialize authentication
import { initializeAuth, requireAuth } from "./api/middleware/auth";

// Import CORS middleware
import corsMiddleware from "./api/middleware/cors";

// Apply CORS middleware
app.use(corsMiddleware);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize authentication (includes session, passport, and auth routes)
initializeAuth(app);

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
