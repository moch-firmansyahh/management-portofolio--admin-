import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Berhasil keluar." });
  response.cookies.delete("portfolio_admin_token");
  return response;
}
