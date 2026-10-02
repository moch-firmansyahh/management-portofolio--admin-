import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Buat client khusus untuk upload, pastikan pakai Service Role Key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

function getSupabaseAdmin() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY belum diset di environment."
    );
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function POST(req: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin();

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

    // Coba upload ke portfolio-assets terlebih dahulu
    const buckets = ["portfolio-assets", "projects"];
    let lastError: any = null;

    for (const bucket of buckets) {
      const { error } = await supabaseAdmin.storage
        .from(bucket)
        .upload(filePath, buffer, {
          contentType: file.type,
          cacheControl: "3600",
          upsert: true,
        });

      if (!error) {
        const { data: publicUrlData } = supabaseAdmin.storage
          .from(bucket)
          .getPublicUrl(filePath);

        console.log(`Upload berhasil ke bucket "${bucket}": ${publicUrlData.publicUrl}`);

        return NextResponse.json({
          success: true,
          url: publicUrlData.publicUrl,
          bucket: bucket,
          path: filePath,
        });
      }

      console.warn(`Upload ke bucket "${bucket}" gagal:`, error.message);
      lastError = error;
    }

    // Semua bucket gagal
    return NextResponse.json(
      { success: false, error: `Upload gagal di semua bucket: ${lastError?.message}` },
      { status: 500 }
    );
  } catch (err: any) {
    console.error("Upload API error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

