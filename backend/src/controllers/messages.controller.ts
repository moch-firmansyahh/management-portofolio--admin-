import { Request, Response, NextFunction } from "express";
import { supabase } from "../config/supabase";
import { ContactMessage } from "../types";

export class MessagesController {
  static async getMessages(_req: Request, res: Response, next: NextFunction) {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("createdAt", { ascending: false });

      if (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

      // Format response agar kompatibel baik properti status maupun boolean read
      const formatted = (data || []).map((m: any) => ({
        ...m,
        read: m.status === "read" || m.read === true,
        createdAt: m.createdAt || m.created_at || new Date().toISOString(),
      }));

      return res.json({ success: true, data: formatted });
    } catch (error) {
      next(error);
    }
  }

  static async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { read = true, status } = req.body;
      const statusValue = status || (read ? "read" : "unread");

      const { data, error } = await supabase
        .from("messages")
        .update({ status: statusValue })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return res.status(400).json({ success: false, message: error.message });
      }

      return res.json({
        success: true,
        message: "Status pesan berhasil diperbarui.",
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { error } = await supabase.from("messages").delete().eq("id", id);

      if (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

      return res.json({ success: true, message: "Pesan berhasil dihapus." });
    } catch (error) {
      next(error);
    }
  }
}
