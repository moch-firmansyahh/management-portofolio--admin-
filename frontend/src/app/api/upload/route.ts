import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "../../../lib/supabaseServer";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "File gambar tidak ditemukan." },
        { status: 400 }
      );
    }

    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, error: "Hanya file gambar (PNG, JPG, WebP, SVG) yang diperbolehkan." },
        { status: 400 }
      );
    }

    // Maksimal 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "Ukuran file maksimal 10 MB." },
        { status: 400 }
      );
    }

    const fileExt = file.name.split(".").pop() || "png";
    const sanitizedExt = fileExt.toLowerCase().replace(/[^a-z0-9]/g, "");
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${sanitizedExt}`;
    const filePath = `projects/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Coba upload ke portfolio-assets, jika tidak ada fallback ke projects
    let targetBucket = "portfolio-assets";
    let uploadRes = await supabaseServer.storage
      .from(targetBucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadRes.error && uploadRes.error.message.includes("not found")) {
      targetBucket = "projects";
      uploadRes = await supabaseServer.storage
        .from(targetBucket)
        .upload(filePath, buffer, {
          contentType: file.type,
          cacheControl: "3600",
          upsert: true,
        });
    }

    if (uploadRes.error) {
      console.error("Storage upload error:", uploadRes.error);
      return NextResponse.json(
        { success: false, error: uploadRes.error.message },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabaseServer.storage
      .from(targetBucket)
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
      bucket: targetBucket,
      path: filePath,
    });
  } catch (err: any) {
    console.error("Upload API error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
