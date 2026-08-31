import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Enable CORS for frontend and website
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Ensure uploads folder exists in backend
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Project public folders
const webPublicProjectsDir = path.resolve(__dirname, "../../../portofolio-web/public/projects");
const adminPublicProjectsDir = path.resolve(__dirname, "../../frontend/public/projects");

// Serve static uploads directly from backend
app.use("/uploads", express.static(uploadsDir));

// Root & Health check routes
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Portfolio Admin API Server", version: "1.2.0" });
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
        totalSizeFormatted: `${(totalSize / (1024 * 1024)).toFixed(2)} MB`,
      },
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
    const ext = path.extname(file.originalname).toLowerCase() || ".png";
    const baseName = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .toLowerCase();
    const uniqueSuffix = Date.now() + "_" + baseName + ext;
    cb(null, uniqueSuffix);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
  ];
  if (allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file gambar (JPG, PNG, WEBP, GIF, SVG) yang diperbolehkan!"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB limit
});

// API upload route - Accept any file field name ('image', 'file', 'photo', etc.)
app.post("/api/upload", upload.any(), (req: any, res: any) => {
  try {
    const file = req.files && req.files.length > 0 ? req.files[0] : req.file;

    if (!file) {
      return res.status(400).json({ error: "Tidak ada file gambar yang diunggah." });
    }

    const filename = file.filename;
    const uploadedFilePath = path.join(uploadsDir, filename);

    // Sync file to portofolio-web and portofolio-admin public folders
    try {
      if (fs.existsSync(webPublicProjectsDir)) {
        fs.copyFileSync(uploadedFilePath, path.join(webPublicProjectsDir, filename));
      }
      if (fs.existsSync(adminPublicProjectsDir)) {
        fs.copyFileSync(uploadedFilePath, path.join(adminPublicProjectsDir, filename));
      }
    } catch (syncErr) {
      console.warn("Notice: could not copy to public folder, serving via Express /uploads:", syncErr);
    }

    const host = req.get("host");
    const protocol = req.protocol;
    const baseUrl = process.env.BASE_URL || `${protocol}://${host}`;
    const fileUrl = `${baseUrl}/uploads/${filename}`;
    const localProjectUrl = `/projects/${filename}`;

    return res.json({
      success: true,
      url: fileUrl,
      imageUrl: fileUrl,
      localUrl: localProjectUrl,
      filename: filename,
    });
  } catch (error: any) {
    console.error("Upload handler error:", error);
    return res.status(500).json({ error: error.message || "Gagal mengupload gambar" });
  }
});

// API delete uploaded file route
app.delete("/api/upload/:filename", (req: any, res: any) => {
  try {
    const { filename } = req.params;
    const sanitizedFilename = path.basename(filename);
    const filePath = path.join(uploadsDir, sanitizedFilename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Also remove from public folders if exists
    try {
      const webPath = path.join(webPublicProjectsDir, sanitizedFilename);
      if (fs.existsSync(webPath)) fs.unlinkSync(webPath);

      const adminPath = path.join(adminPublicProjectsDir, sanitizedFilename);
      if (fs.existsSync(adminPath)) fs.unlinkSync(adminPath);
    } catch (_) {}

    return res.json({ status: "success", message: `File ${sanitizedFilename} berhasil dihapus.` });
  } catch (error: any) {
    console.error("Delete handler error:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Express global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "Ukuran file terlalu besar! Maksimal 15 MB." });
    }
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ error: err.message || "Terjadi kesalahan server backend" });
  }
  next();
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend Express server is running on http://localhost:${PORT}`);
});
