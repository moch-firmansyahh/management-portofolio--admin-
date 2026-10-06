import { NextRequest, NextResponse } from "next/server";

const CACHE_TTL = 10 * 60 * 1000; // 10 menit
let cache: { data: any; timestamp: number } | null = null;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username") || "moch-firmansyahh";

    // Return cached data jika masih valid
    if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
      return NextResponse.json(
        { success: true, data: cache.data, cached: true },
        {
          headers: {
            "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600",
          },
        }
      );
    }

    const response = await fetch(
      `https://api.github.com/users/${username}`,
      {
        headers: {
          "User-Agent": "PortfolioAdmin/1.0",
          Accept: "application/vnd.github.v3+json",
        },
        next: { revalidate: 600 },
      }
    );

    if (!response.ok) {
      if (response.status === 403 && cache) {
        return NextResponse.json(
          { success: true, data: cache.data, cached: true, rateLimited: true },
          { status: 200 }
        );
      }
      return NextResponse.json(
        { success: false, error: `GitHub API error: ${response.status}` },
        { status: response.status }
      );
    }

    const profile = await response.json();
    cache = { data: profile, timestamp: Date.now() };

    return NextResponse.json(
      { success: true, data: profile },
      {
        headers: {
          "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600",
        },
      }
    );
  } catch (err: any) {
    if (cache) {
      return NextResponse.json(
        { success: true, data: cache.data, cached: true },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch GitHub profile" },
      { status: 500 }
    );
  }
}
