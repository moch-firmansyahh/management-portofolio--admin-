import { NextResponse } from "next/server";
import { getProfile, saveProfile } from "../../../lib/api/profile";

export async function GET() {
  try {
    const profile = await getProfile();
    return NextResponse.json({ success: true, data: profile });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await saveProfile(body);
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
