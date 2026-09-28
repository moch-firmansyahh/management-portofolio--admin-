import { Request, Response, NextFunction } from "express";
import { supabase } from "../config/supabase";
import { Project } from "../types";

export class ProjectsController {
  /**
   * GET /api/projects
   * Mengambil semua daftar proyek
   */
  static async getProjects(_req: Request, res: Response, next: NextFunction) {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

      return res.json({
        success: true,
        data: (data || []) as Project[],
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/projects/:id
   * Mengambil satu proyek spesifik beserta detail studi kasus
   */
  static async getProjectById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        return res.status(404).json({
          success: false,
          message: `Proyek dengan ID ${id} tidak ditemukan.`,
        });
      }

      return res.json({ success: true, data: data as Project });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/projects
   * Menambahkan proyek baru
   */
  static async createProject(req: Request, res: Response, next: NextFunction) {
    try {
      const projectPayload = req.body;

      if (!projectPayload.title || !projectPayload.description) {
        return res.status(400).json({
          success: false,
          message: "Judul dan ringkasan proyek wajib diisi.",
        });
      }

      const { data, error } = await supabase
        .from("projects")
        .insert([projectPayload])
        .select()
        .single();

      if (error) {
        return res.status(400).json({ success: false, message: error.message });
      }

      return res.status(201).json({
        success: true,
        message: "Proyek baru berhasil ditambahkan.",
        data: data as Project,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/projects/:id
   * Memperbarui informasi proyek & narasi studi kasus
   */
  static async updateProject(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const { data, error } = await supabase
        .from("projects")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return res.status(400).json({ success: false, message: error.message });
      }

      return res.json({
        success: true,
        message: "Proyek berhasil diperbarui.",
        data: data as Project,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/projects/:id
   * Menghapus proyek dari database
   */
  static async deleteProject(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const { error } = await supabase.from("projects").delete().eq("id", id);

      if (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

      return res.json({
        success: true,
        message: `Proyek dengan ID ${id} berhasil dihapus.`,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/projects/:id/case-study
   * Mengambil detail studi kasus (/projects/[id])
   */
  static async getCaseStudy(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        return res.status(404).json({
          success: false,
          message: `Studi kasus untuk proyek ID ${id} tidak ditemukan.`,
        });
      }

      return res.json({
        success: true,
        data: {
          id: data.id,
          title: data.title,
          subtitle: data.subtitle || data.description,
          longDescription: data.longDescription || data.description,
          highlights: data.highlights || [],
          metrics: data.metrics || "",
          tags: data.tags || [],
          category: data.category,
          featured: data.featured,
          image: data.image,
          demoUrl: data.demoUrl || data.link || "",
          githubUrl: data.githubUrl || "",
          year: data.year,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/projects/:id/case-study
   * Memperbarui narasi, checklist highlights, dan metrik studi kasus
   */
  static async updateCaseStudy(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { longDescription, highlights, metrics, tags, subtitle } = req.body;

      const payloadToUpdate: Record<string, any> = {};
      if (longDescription !== undefined) payloadToUpdate.longDescription = longDescription;
      if (highlights !== undefined) payloadToUpdate.highlights = highlights;
      if (metrics !== undefined) payloadToUpdate.metrics = metrics;
      if (tags !== undefined) payloadToUpdate.tags = tags;
      if (subtitle !== undefined) payloadToUpdate.subtitle = subtitle;

      const { data, error } = await supabase
        .from("projects")
        .update(payloadToUpdate)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return res.status(400).json({ success: false, message: error.message });
      }

      return res.json({
        success: true,
        message: "Detail studi kasus proyek berhasil diperbarui.",
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}
