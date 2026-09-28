import { Request, Response, NextFunction } from "express";
import { supabase } from "../config/supabase";
import { Experience } from "../types";

export class ExperiencesController {
  static async getExperiences(_req: Request, res: Response, next: NextFunction) {
    try {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

      return res.json({ success: true, data: (data || []) as Experience[] });
    } catch (error) {
      next(error);
    }
  }

  static async createExperience(req: Request, res: Response, next: NextFunction) {
    try {
      const { data, error } = await supabase
        .from("experiences")
        .insert([req.body])
        .select()
        .single();

      if (error) {
        return res.status(400).json({ success: false, message: error.message });
      }

      return res.status(201).json({
        success: true,
        message: "Riwayat pengalaman berhasil ditambahkan.",
        data: data as Experience,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateExperience(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from("experiences")
        .update(req.body)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return res.status(400).json({ success: false, message: error.message });
      }

      return res.json({
        success: true,
        message: "Riwayat pengalaman berhasil diperbarui.",
        data: data as Experience,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteExperience(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { error } = await supabase
        .from("experiences")
        .delete()
        .eq("id", id);

      if (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

      return res.json({
        success: true,
        message: "Riwayat pengalaman berhasil dihapus.",
      });
    } catch (error) {
      next(error);
    }
  }
}
