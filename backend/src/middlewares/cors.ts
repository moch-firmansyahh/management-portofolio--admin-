import cors from "cors";

const allowedOriginsEnv = process.env.CORS_ORIGIN || "http://localhost:3000,http://127.0.0.1:3000";
const allowedOrigins = allowedOriginsEnv.split(",").map((origin) => origin.trim());

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Izinkan request tanpa origin (seperti curl, mobile app, Postman, server-to-server)
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.indexOf(origin) !== -1 ||
      allowedOrigins.includes("*") ||
      origin.endsWith(".vercel.app") ||
      origin.endsWith(".azurewebsites.net") ||
      process.env.NODE_ENV === "development"
    ) {
      return callback(null, true);
    } else {
      return callback(new Error(`Origin ${origin} tidak diizinkan oleh kebijakan CORS.`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "apikey", "x-client-info"],
});
