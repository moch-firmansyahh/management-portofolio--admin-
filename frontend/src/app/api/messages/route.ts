import { NextResponse } from "next/server";
import { getMessages } from "../../../lib/api/messages";

export async function GET() {
  try {
    const messages = await getMessages();
    return NextResponse.json({ success: true, data: messages });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
