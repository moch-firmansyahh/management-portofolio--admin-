import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Berhasil keluar." });
  response.cookies.set("portfolio_admin_token", "", {
    maxAge: 0,
    path: "/",
    expires: new Date(0),
  });
  return response;
}
