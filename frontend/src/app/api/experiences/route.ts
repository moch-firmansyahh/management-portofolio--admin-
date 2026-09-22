import { NextResponse } from "next/server";
import { getExperiences, createExperience } from "../../../lib/api/experiences";

export async function GET() {
  try {
    const experiences = await getExperiences();
    return NextResponse.json({ success: true, data: experiences });
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
    const newExperience = await createExperience(body);
    return NextResponse.json({ success: true, data: newExperience }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
