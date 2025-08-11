import express from "express";
import fs from "fs";
import path from "path";
import { RouteHandlers, RouteHandler } from "../types";

const router = express.Router();

// Dynamically load all handler modules
const handlersDir = path.join(__dirname, "handlers");

if (fs.existsSync(handlersDir)) {
  const handlerItems: string[] = fs.readdirSync(handlersDir).filter((item: string) => !item.startsWith("."));

  handlerItems.forEach((item: string) => {
    const itemPath = path.join(handlersDir, item);
    const stats = fs.statSync(itemPath);

    let handler: RouteHandlers | undefined;

    if (stats.isDirectory()) {
      // Load index.ts from the directory
      const indexPath = path.join(itemPath, "index");
      try {
        handler = require(indexPath).default || require(indexPath);
      } catch (error) {
        console.warn(`Could not load handler from ${indexPath}:`, error);
      }
    } else if (item.endsWith(".js") || item.endsWith(".ts")) {
      // Load .js/.ts file directly (for backward compatibility)
      try {
        const modulePath = path.join(handlersDir, item.replace(/\.[jt]s$/, ""));
        handler = require(modulePath).default || require(modulePath);
      } catch (error) {
        console.warn(`Could not load handler from ${item}:`, error);
      }
    }

    if (handler) {
      // Handle both single handler objects and arrays of handlers
      const handlers: RouteHandler[] = Array.isArray(handler) ? handler : [handler];

      handlers.forEach((h: RouteHandler) => {
        if (h && h.route && h.method && h.handler) {
          const method = h.method.toLowerCase() as keyof express.IRouter;
          if (typeof router[method] === "function") {
            (router[method] as any)(h.route, h.handler);
            console.log(`Loaded API route: ${h.method.toUpperCase()} ${h.route}`);
          }
        }
      });
    }
  });
}

// Health check endpoint
router.get("/health", (req: express.Request, res: express.Response) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

export default router;
