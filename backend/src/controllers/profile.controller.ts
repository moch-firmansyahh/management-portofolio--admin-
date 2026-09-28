import { Request, Response, NextFunction } from "express";
import { supabase } from "../config/supabase";
import { ProfileData } from "../types";

// Kolom resmi yang terdaftar di skema PostgreSQL Supabase
const VALID_DB_PROFILE_COLUMNS = [
  "id",
  "name",
  "title",
  "role",
  "shortName",
  "tagline",
  "about",
  "bio",
  "status",
  "email",
  "phone",
  "github",
  "linkedin",
  "instagram",
  "resumeUrl",
  "socialLinks",
  "stats",
  "updatedAt",
];

export class ProfileController {
  /**
   * GET /api/profile
   * Mengambil data profil utama admin
   */
  static async getProfile(_req: Request, res: Response, next: NextFunction) {
    try {
      const { data, error } = await supabase
        .from("profile")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        return res.status(500).json({ success: false, message: error.message });
      }

      return res.json({
        success: true,
        data: (data || null) as ProfileData | null,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/profile
   * Memperbarui profil dengan sanitasi payload otomatis (mencegah error 400 Bad Request)
   */
  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const rawPayload = {
        id: "main",
        ...req.body,
        updatedAt: new Date().toISOString(),
      };

      // Whitelist filtering: Hanya ambil properti yang valid di database Supabase
      const payload: Record<string, any> = {};
      for (const col of VALID_DB_PROFILE_COLUMNS) {
        if (col in rawPayload && rawPayload[col] !== undefined) {
          payload[col] = rawPayload[col];
        }
      }

      const { data, error } = await supabase
        .from("profile")
        .upsert(payload)
        .select()
        .single();

      if (error) {
        return res.status(400).json({ success: false, message: error.message });
      }

      return res.json({
        success: true,
        message: "Profil berhasil diperbarui.",
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}
