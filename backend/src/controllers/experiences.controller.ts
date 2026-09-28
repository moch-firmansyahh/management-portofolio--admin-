import { Request, Response, NextFunction } from "express";
import { supabase } from "../config/supabase";
import { Experience } from "../types";

const MONTH_NAMES_MAP: Record<string, number> = {
  jan: 1, januari: 1, january: 1,
  feb: 2, februari: 2, february: 2,
  mar: 3, maret: 3, march: 3,
  apr: 4, april: 4,
  mei: 5, may: 5,
  jun: 6, juni: 6, june: 6,
  jul: 7, juli: 7, july: 7,
  agu: 8, ags: 8, agust: 8, agustus: 8, aug: 8, august: 8,
  sep: 9, sept: 9, september: 9,
  okt: 10, oct: 10, oktober: 10, october: 10,
  nov: 11, nop: 11, november: 11,
  des: 12, dec: 12, desember: 12, december: 12,
};

function parseSingleDateScore(str?: string, isEnd = false): number {
  if (!str) return 0;
  const s = str.trim().toLowerCase();
  if (["present", "sekarang", "current", "saat ini", "now", "skrg"].some((k) => s.includes(k))) {
    return 999999;
  }
  const yearMatch = s.match(/\b(19\d\d|20\d\d)\b/);
  const year = yearMatch ? parseInt(yearMatch[1], 10) : 0;
  if (!year) return 0;

  let month = isEnd ? 12 : 1;
  for (const [mName, mNum] of Object.entries(MONTH_NAMES_MAP)) {
    const regex = new RegExp(`\\b${mName}\\b`, "i");
    if (regex.test(s)) {
      month = mNum;
      break;
    }
  }
  return year * 100 + month;
}

function sortExperiences<T extends { period?: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const periodA = a.period || "";
    const periodB = b.period || "";

    const partsA = periodA.split(/[-–—]/);
    const partsB = periodB.split(/[-–—]/);

    const endA = partsA.length >= 2 ? parseSingleDateScore(partsA[1], true) : parseSingleDateScore(partsA[0], false);
    const endB = partsB.length >= 2 ? parseSingleDateScore(partsB[1], true) : parseSingleDateScore(partsB[0], false);

    if (endA !== endB) {
      return endB - endA;
    }

    const startA = parseSingleDateScore(partsA[0], false);
    const startB = parseSingleDateScore(partsB[0], false);
    return startB - startA;
  });
}

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

      const sortedData = sortExperiences((data || []) as Experience[]);
      return res.json({ success: true, data: sortedData });
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
