import dotenv from "dotenv";
dotenv.config();

import app from "./app";

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log("==================================================");
  console.log(`🚀 REST API Backend Server is running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🩺 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🛡️ CORS Allowed Origin: ${process.env.CORS_ORIGIN || "http://localhost:3000"}`);
  console.log(`📁 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("==================================================");
});

// Graceful shutdown handling
process.on("SIGINT", () => {
  console.log("\n🛑 Server shutting down...");
  server.close(() => {
    console.log("✅ Server closed cleanly.");
    process.exit(0);
  });
});
