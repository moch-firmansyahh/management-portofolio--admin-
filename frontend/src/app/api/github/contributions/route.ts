import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username") || "moch-firmansyahh";

    const response = await fetch(`https://github.com/users/${username}/contributions`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "text/html",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `GitHub profile not found: ${response.status}` },
        { status: response.status }
      );
    }

    const html = await response.text();

    // Parse all days from GitHub contributions grid
    const days: Array<{ date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }> = [];
    const cellRegex = /<td[^>]*data-date="([^"]+)"[^>]*data-level="([0-4])"[^>]*>/g;
    
    let match;
    while ((match = cellRegex.exec(html)) !== null) {
      const date = match[1];
      const level = parseInt(match[2], 10) as 0 | 1 | 2 | 3 | 4;
      // Estimasi hitungan kontribusi berdasarkan level aktivitas jika exact count di tooltip
      const count = level === 0 ? 0 : level === 1 ? 2 : level === 2 ? 5 : level === 3 ? 9 : 15;
      days.push({ date, count, level });
    }

    // Jika regex cell pertama tidak menghasilkan (karena update layout GitHub), gunakan regex fleksibel
    if (days.length === 0) {
      const flexibleRegex = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="([0-4])"/g;
      while ((match = flexibleRegex.exec(html)) !== null) {
        const date = match[1];
        const level = parseInt(match[2], 10) as 0 | 1 | 2 | 3 | 4;
        const count = level === 0 ? 0 : level * 3;
        days.push({ date, count, level });
      }
    }

    // Urutkan tanggal secara kronologis (ascending)
    days.sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json(
      { success: true, username, total: days.length, data: days },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch GitHub contributions" },
      { status: 500 }
    );
  }
}
