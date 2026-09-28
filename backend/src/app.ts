import express from "express";
import { corsMiddleware } from "./middlewares/cors";
import { errorHandler } from "./middlewares/errorHandler";
import routes from "./routes";

const app = express();

// 1. Core Middlewares
app.use(corsMiddleware);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 2. Request Logging Middleware (berguna untuk demo ke dosen)
app.use((req, _res, next) => {
  const timestamp = new Date().toLocaleTimeString("id-ID");
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// 3. Welcome / Root route
app.get("/", (_req, res) => {
  res.json({
    name: "Portfolio CMS REST API Server",
    version: "1.0.0",
    documentation: "/api/health",
    status: "running",
  });
});

// 4. API Routes (/api)
app.use("/api", routes);

// 5. 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan di server.`,
  });
});

// 6. Central Error Handler Middleware
app.use(errorHandler);

export default app;
