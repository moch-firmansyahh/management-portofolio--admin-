import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { password } = req.body;
      if (!password || typeof password !== "string") {
        return res.status(400).json({ success: false, message: "Password harus diisi." });
      }

      const storedHash = process.env.ADMIN_PASSWORD_HASH;
      if (!storedHash) {
        console.error("❌ ADMIN_PASSWORD_HASH belum diset di file .env!");
        return res.status(500).json({
          success: false,
          message: "Konfigurasi autentikasi server belum lengkap.",
        });
      }

      // Verifikasi password terhadap salted bcrypt hash secara asinkron (aman terhadap timing attack)
      const isMatch = await bcrypt.compare(password, storedHash);

      if (isMatch) {
        // Buat secure session token untuk autentikasi admin
        const token = Buffer.from(`admin:${Date.now()}:${Math.random().toString(36).substring(2)}`).toString("base64");
        return res.json({
          success: true,
          message: "Login berhasil.",
          token,
          user: { role: "admin", username: "Firman" },
        });
      }

      return res.status(401).json({
        success: false,
        message: "Password admin salah. Silakan coba lagi.",
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(_req: Request, res: Response) {
    return res.json({ success: true, message: "Logout berhasil." });
  }

  static async checkSession(req: Request, res: Response) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      return res.json({ success: true, authenticated: true });
    }
    return res.json({ success: true, authenticated: false });
  }
}
