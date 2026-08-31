import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Enable CORS
app.use(cors());
app.use(express.json());

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static uploads
app.use("/uploads", express.static(uploadsDir));

// Root & Health check routes
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Portfolio Admin API Server", version: "1.0.0" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "online", timestamp: new Date().toISOString() });
});

// API stats route
app.get("/api/stats", (req, res) => {
  try {
    const files = fs.existsSync(uploadsDir) ? fs.readdirSync(uploadsDir) : [];
    let totalSize = 0;
    files.forEach((file) => {
      try {
        const stats = fs.statSync(path.join(uploadsDir, file));
        totalSize += stats.size;
      } catch (_) {}
    });

    res.json({
      status: "online",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      uploads: {
        count: files.length,
        totalSizeBytes: totalSize,
        totalSizeFormatted: `${(totalSize / (1024 * 1024)).toFixed(2)} MB`
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueSuffix = Date.now() + "_" + safeName;
    cb(null, uniqueSuffix);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file gambar (JPG, PNG, WEBP, GIF, SVG) yang diperbolehkan!"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB limit
});

// API upload route
app.post("/api/upload", upload.single("file"), (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const host = req.get("host");
    const protocol = req.protocol;
    const baseUrl = process.env.BASE_URL || `${protocol}://${host}`;
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
    
    return res.json({ url: fileUrl, filename: req.file.filename });
  } catch (error: any) {
    console.error("Upload handler error:", error);
    return res.status(500).json({ error: error.message });
  }
});

// API delete uploaded file route
app.delete("/api/upload/:filename", (req: any, res: any) => {
  try {
    const { filename } = req.params;
    const sanitizedFilename = path.basename(filename);
    const filePath = path.join(uploadsDir, sanitizedFilename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    fs.unlinkSync(filePath);
    return res.json({ status: "success", message: `File ${sanitizedFilename} deleted successfully` });
  } catch (error: any) {
    console.error("Delete handler error:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Express global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "Ukuran file terlalu besar! Maksimal 5 MB." });
    }
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ error: err.message || "Terjadi kesalahan server" });
  }
  next();
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend Express server is running on http://localhost:${PORT}`);
});


