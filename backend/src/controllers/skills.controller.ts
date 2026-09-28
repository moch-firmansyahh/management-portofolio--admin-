import { Request, Response, NextFunction } from "express";
import { supabase } from "../config/supabase";
import { Skill } from "../types";

export class SkillsController {
  static async getSkills(_req: Request, res: Response, next: NextFunction) {
    try {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

      return res.json({ success: true, data: (data || []) as Skill[] });
    } catch (error) {
      next(error);
    }
  }

  static async createSkill(req: Request, res: Response, next: NextFunction) {
    try {
      const skillPayload = req.body;
      const { data, error } = await supabase
        .from("skills")
        .insert([skillPayload])
        .select()
        .single();

      if (error) {
        return res.status(400).json({ success: false, message: error.message });
      }

      return res.status(201).json({
        success: true,
        message: "Keahlian berhasil ditambahkan.",
        data: data as Skill,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateSkill(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from("skills")
        .update(req.body)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return res.status(400).json({ success: false, message: error.message });
      }

      return res.json({
        success: true,
        message: "Keahlian berhasil diperbarui.",
        data: data as Skill,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteSkill(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { error } = await supabase.from("skills").delete().eq("id", id);

      if (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

      return res.json({ success: true, message: "Keahlian berhasil dihapus." });
    } catch (error) {
      next(error);
    }
  }

  static async deleteByCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { category } = req.params;
      const { error } = await supabase
        .from("skills")
        .delete()
        .eq("category", category);

      if (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

      return res.json({
        success: true,
        message: `Semua keahlian dalam kategori ${category} berhasil dihapus.`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { category, skills = [] } = req.body;
      if (!category) {
        return res.status(400).json({ success: false, message: "Nama kategori wajib diisi." });
      }

      if (Array.isArray(skills) && skills.length > 0) {
        const items = skills.map((s: any) => ({
          name: s.name,
          logo: s.logo || "",
          percent: s.percent || 80,
          category,
        }));
        const { data, error } = await supabase.from("skills").insert(items).select();
        if (error) return res.status(400).json({ success: false, message: error.message });
        return res.status(201).json({
          success: true,
          message: `Kategori '${category}' berhasil dibuat dengan ${items.length} keahlian.`,
          data,
        });
      }

      const defaultSkill = {
        name: req.body.skillName || req.body.name || "General",
        logo: req.body.logo || "",
        percent: req.body.percent || 80,
        category,
      };

      const { data, error } = await supabase.from("skills").insert([defaultSkill]).select().single();
      if (error) return res.status(400).json({ success: false, message: error.message });

      return res.status(201).json({
        success: true,
        message: `Kategori '${category}' berhasil dibuat.`,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}
