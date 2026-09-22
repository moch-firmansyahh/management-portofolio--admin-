import { NextResponse } from "next/server";
import { getSkills, createSkill } from "../../../lib/api/skills";

export async function GET() {
  try {
    const skills = await getSkills();
    return NextResponse.json({ success: true, data: skills });
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
    const newSkill = await createSkill(body);
    return NextResponse.json({ success: true, data: newSkill }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
